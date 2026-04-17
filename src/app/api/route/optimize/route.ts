import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import type { OptimizeRequest, DirectionsApiResponse, DirectionsLeg } from "@/types";

interface LimitResult {
  limitReached: boolean;
}

async function checkSearchLimit(origin: string, destination: string, waypoints: string[]): Promise<LimitResult> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("Vercel KV is not configured. Skipping limit check.");
    return { limitReached: false };
  }

  try {
    const now = new Date();
    const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const currentMonthKey = `usage:limit:${jstNow.getUTCFullYear()}-${jstNow.getUTCMonth() + 1}`;

    const usageCount = await kv.incr(currentMonthKey);
    if (usageCount === 1) {
      await kv.expire(currentMonthKey, 60 * 60 * 24 * 32);
    }

    if (usageCount > 200) {
      return { limitReached: true };
    }

    const logEntry = {
      timestamp: jstNow.toISOString(),
      origin,
      destination,
      waypoints,
    };

    await kv.lpush("search:logs", JSON.stringify(logEntry));
    await kv.ltrim("search:logs", 0, 999);

    return { limitReached: false };
  } catch (err) {
    console.error("Vercel KV Error:", err);
    return { limitReached: false };
  }
}

async function callGoogleDirectionsApi(
  origin: string,
  destination: string,
  waypoints: string[],
  apiKey: string
): Promise<DirectionsApiResponse> {
  const params = new URLSearchParams({ origin, destination, key: apiKey });

  if (waypoints.length > 0) {
    params.set("waypoints", `optimize:true|${waypoints.join("|")}`);
  }

  const gmapUrl = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
  const res = await fetch(gmapUrl);
  return res.json();
}

function parseDirectionsResponse(data: DirectionsApiResponse, waypoints: string[]) {
  if (data.status !== "OK" || data.routes.length === 0) {
    throw new Error(`Route not found. Status: ${data.status}`);
  }

  const route = data.routes[0];
  const optimizedOrder = route.waypoint_order;
  const optimizedWaypoints = optimizedOrder.map((i: number) => waypoints[i]);

  let totalDistance = 0;
  let totalDurationSec = 0;
  const formattedLegs: DirectionsLeg[] = route.legs.map((leg) => {
    totalDistance += leg.distance.value;
    totalDurationSec += leg.duration.value;
    return {
      start_address: leg.start_address,
      end_address: leg.end_address,
      distance: { value: leg.distance.value, text: leg.distance.text },
      duration: { value: leg.duration.value, text: leg.duration.text },
    };
  });

  return {
    waypoints_order: optimizedOrder,
    optimized_waypoints: optimizedWaypoints,
    total_distance_km: totalDistance / 1000,
    total_duration_min: Math.floor(totalDurationSec / 60),
    legs: formattedLegs,
  };
}

export async function POST(req: Request) {
  try {
    const body: OptimizeRequest = await req.json();
    const { origin, destination, waypoints = [] } = body;

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and Destination are required." },
        { status: 400 }
      );
    }

    const { limitReached } = await checkSearchLimit(origin, destination, waypoints);
    if (limitReached) {
      return NextResponse.json(
        { error: "Search limit reached (200 requests/month)." },
        { status: 429 }
      );
    }

    const apiKey = process.env.MAPS_API_KEY || process.env.NEXT_PUBLIC_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API Key is not configured." },
        { status: 500 }
      );
    }

    const directionsData = await callGoogleDirectionsApi(origin, destination, waypoints, apiKey);
    const result = parseDirectionsResponse(directionsData, waypoints);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
