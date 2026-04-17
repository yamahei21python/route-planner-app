// Location Types
export interface Location {
  name: string;
  lat?: number;
  lng?: number;
}

export interface Waypoint extends Location {
  id: string;
  order: number;
}

// Route Types
export interface RouteLeg {
  start_location: Location;
  end_location: Location;
  distance_km: number;
  duration_min: number;
}

export interface OptimizedRoute {
  total_distance_km: number;
  total_duration_min: number;
  optimized_waypoints: string[];
  legs?: RouteLeg[];
}

// Component Props Types
export interface SidebarProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  waypoints: string[];
  setWaypoints: (value: string[]) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
  optimizedRoute: OptimizedRoute | null;
  setOptimizedRoute: (route: OptimizedRoute | null) => void;
}

export interface InteractiveMapProps {
  origin: string;
  destination: string;
  waypoints: string[];
  optimizedRoute: OptimizedRoute | null;
}

export interface RouteListProps {
  optimizedRoute: OptimizedRoute;
  setOptimizedRoute: (route: OptimizedRoute | null) => void;
  origin: string;
  destination: string;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  origin: string;
  destination: string;
  waypoints: string[];
}

// API Types
export interface OptimizeRequest {
  origin: string;
  destination: string;
  waypoints: string[];
}

export interface OptimizeResponse {
  total_distance_km: number;
  total_duration_min: number;
  optimized_waypoints: string[];
}

// Google Maps API Types
export interface DirectionsLeg {
  start_address: string;
  end_address: string;
  distance: { value: number; text: string };
  duration: { value: number; text: string };
}

export interface DirectionsRoute {
  legs: DirectionsLeg[];
  waypoint_order: number[];
}

export interface DirectionsApiResponse {
  status: string;
  routes: DirectionsRoute[];
}