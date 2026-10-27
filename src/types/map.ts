import type { Region } from "../utils/region";

/** Un punto dentro del mapa de Costa Rica (unidades del viewBox). */
export interface ZonePoint {
  x: number;
  y: number;
}

/** Una zona del catálogo lista para el filtro: con su conteo, su región y su lugar en el mapa. */
export interface MapZone {
  /** El valor completo de "location", por ejemplo "Escazú, San José". */
  location: string;
  /** Lo que se muestra, por ejemplo "Escazú". */
  name: string;
  count: number;
  region: Region;
  /** null si la zona todavía no tiene lugar en el mapa (igual aparece en el índice). */
  point: ZonePoint | null;
}
