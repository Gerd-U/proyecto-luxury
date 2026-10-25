export type Region = "valle" | "pacifico";

export type RegionFilter = Region | "todas";

export interface RegionOption {
  value: RegionFilter;
  label: string;
}

export const REGION_OPTIONS: RegionOption[] = [
  { value: "todas", label: "Todas" },
  { value: "valle", label: "Valle Central" },
  { value: "pacifico", label: "Pacífico" },
];

const PACIFIC_PROVINCES: string[] = ["Guanacaste", "Puntarenas"];

/** Determina la región a partir de la provincia. */
export function getRegion(location: string): Region {
  const province = location.split(",").pop()?.trim() ?? "";
  return PACIFIC_PROVINCES.includes(province) ? "pacifico" : "valle";
}
