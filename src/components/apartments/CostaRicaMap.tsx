import { COSTA_RICA_PATH, COSTA_RICA_VIEWBOX } from "../../data/costaRicaMap";
import type { MapZone } from "../../types/map";
import type { Region } from "../../utils/region";
import "./CostaRicaMap.css";

interface CostaRicaMapProps {
  zones: MapZone[];
  selected: string;
  focusedRegion: Region | null;
  onSelectZone: (location: string) => void;
  onSelectRegion: (region: Region) => void;
}

// el índice permite elegir zonas sin usar el mapa
function CostaRicaMap({
  zones,
  selected,
  focusedRegion,
  onSelectZone,
  onSelectRegion,
}: CostaRicaMapProps) {
  const valley = zones.filter((zone) => zone.region === "valle" && zone.point !== null);
  const pacific = zones.filter((zone) => zone.region === "pacifico" && zone.point !== null);

  const valleyTotal = valley.reduce((sum, zone) => sum + zone.count, 0);
  const valleyCenter = valley.reduce(
    (center, zone) => ({
      x: center.x + (zone.point?.x ?? 0) / valley.length,
      y: center.y + (zone.point?.y ?? 0) / valley.length,
    }),
    { x: 0, y: 0 },
  );
  const isValleyActive =
    focusedRegion === "valle" || valley.some((zone) => zone.location === selected);

  return (
    <svg
      className="cr-map"
      viewBox={COSTA_RICA_VIEWBOX}
      aria-hidden="true"
      focusable="false"
    >
      <path className="cr-map__land" d={COSTA_RICA_PATH} pathLength={1} />

      {valley.length > 0 && (
        <g
          className={`cr-map__cluster${isValleyActive ? " is-active" : ""}`}
          onClick={() => onSelectRegion("valle")}
        >
          <circle className="cr-map__hit" cx={valleyCenter.x} cy={valleyCenter.y} r={16} />
          {/* reinicia el pulso cuando cambia la zona */}
          {isValleyActive && (
            <circle
              key={selected || "valle"}
              className="cr-map__pulse"
              cx={valleyCenter.x}
              cy={valleyCenter.y}
              r={8}
            />
          )}
          <circle className="cr-map__dot cr-map__dot--valley" cx={valleyCenter.x} cy={valleyCenter.y} r={7} />
          <text className="cr-map__region" x={valleyCenter.x + 13} y={valleyCenter.y - 9}>
            Valle Central · {valleyTotal}
          </text>
        </g>
      )}

      {pacific.map((zone) => {
        const isSelected = zone.location === selected;
        return (
          <g
            key={zone.location}
            className={`cr-map__zone${isSelected ? " is-selected" : ""}`}
            onClick={() => onSelectZone(zone.location)}
          >
            <circle className="cr-map__hit" cx={zone.point?.x} cy={zone.point?.y} r={13} />
            {isSelected && (
              <circle className="cr-map__pulse" cx={zone.point?.x} cy={zone.point?.y} r={6} />
            )}
            <circle
              className="cr-map__dot"
              cx={zone.point?.x}
              cy={zone.point?.y}
              r={zone.count > 1 ? 5.5 : 4.5}
            />
            <text
              className="cr-map__label"
              x={(zone.point?.x ?? 0) + 10}
              y={(zone.point?.y ?? 0) + 4}
            >
              {zone.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default CostaRicaMap;
