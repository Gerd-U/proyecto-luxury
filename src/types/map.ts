import type { Region } from "../utils/region";

// coordenadas relativas al viewbox
export interface ZonePoint {
  x: number;
  y: number;
}

export interface MapZone {
  location: string;
  name: string;
  count: number;
  region: Region;
  // null conserva la zona sin punto en el mapa
  point: ZonePoint | null;
}
