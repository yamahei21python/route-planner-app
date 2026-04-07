import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

async function checkSearchLimitAndLog(origin: string, destination: string, waypoints: string[]) {
  // Check if KV is configured
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    console.warn("Vercel KV is not configured. Skipping limit check and logging.");
    return { limitReached: false };
  }

  try {
    const now = new Date();
    const jstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // JST
    const currentMonthKey = `usage:limit:${jstNow.getUTCFullYear()}-${jstNow.getUTCMonth() + 1}`;

    // Increments and checks usage in one atomic step (if using Redis incr)
    const usageCount = await kv.incr(currentMonthKey);
    
    // Set expiry if it's the first hit of the month (optional but good practice)
    if (usageCount === 1) {
        await kv.expire(currentMonthKey, 60 * 60 * 24 * 32); // ~1 month
    }

    if (usageCount > 200) {
      return { limitReached: true };
    }

    // --- Record detailed log ---
    const logEntry = {
      timestamp: jstNow.toISOString(),
      origin,
      destination,
      waypoints: waypoints,
    };
    
    // Using simple list to store latest logs
    await kv.lpush("search:logs", JSON.stringify(logEntry));
    await kv.ltrim("search:logs", 0, 999); // Keep last 1000 logs

  } catch (err) {
    console.error("Vercel KV Error:", err);
  }

  return { limitReached: false };
}

export async function POST(req: Request) {
  try {
    const { origin, destination, waypoints } = await req.json();

    if (!origin || !destination) {
      return NextResponse.json({ error: "Origin and Destination are required." }, { status: 400 });
    }

    const { limitReached } = await checkSearchLimitAndLog(origin, destination, waypoints || []);
    if (limitReached) {
      return NextResponse.json({ error: "Search limit reached (200 requests/month)." }, { status: 429 });
    }

    const apiKey = process.env.MAPS_API_KEY || process.env.NEXT_PUBLIC_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API Key is not configured." }, { status: 500 });
    }

    const params = new URLSearchParams({
      origin,
      destination,
      key: apiKey,
    });
    if (waypoints && waypoints.length > 0) {
        params.set('waypoints', 'optimize:true|' + waypoints.join('|'));
    }

    const gmapUrl = `https://maps.googleapis.com/maps/api/directions/json?${params.toString()}`;
    const res = await fetch(gmapUrl);
    const data = await res.json();

    if (data.status !== "OK" || data.routes.length === 0) {
       return NextResponse.json({ error: `Route not found. Status: ${data.status}` }, { status: 400 });
    }

    const route = data.routes[0];
    const optimized_order = route.waypoint_order || [];
    const optimized_waypoints = optimized_order.map((i: number) => waypoints[i]);

    let total_distance = 0;
    let total_duration_sec = 0;
    const formatted_legs = route.legs.map((leg: any) => {
      total_distance += leg.distance.value;
      total_duration_sec += leg.duration.value;
      return {
        start_address: leg.start_address,
        end_address: leg.end_address,
        distance_text: leg.distance.text,
        duration_text: leg.duration.text
      };
    });

    return NextResponse.json({
        waypoints_order: optimized_order,
        optimized_waypoints,
        total_distance_km: total_distance / 1000.0,
        total_duration_min: Math.floor(total_duration_sec / 60),
        legs: formatted_legs
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
