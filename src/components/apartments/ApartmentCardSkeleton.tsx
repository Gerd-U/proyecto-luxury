import "./ApartmentCardSkeleton.css";

interface ApartmentCardSkeletonProps {
  count?: number;
}

export default function ApartmentCardSkeleton({ count = 5 }: ApartmentCardSkeletonProps) {
  const rows = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="card-skeleton" role="status">
      <span className="sr-only">Cargando residencias…</span>
      {rows.map((row) => (
        <div
          key={row}
          className={`card-skeleton__row ${row % 2 === 1 ? "card-skeleton__row--reverse" : ""}`}
          aria-hidden="true"
        >
          <div className="card-skeleton__media" />
          <div className="card-skeleton__body">
            <span className="card-skeleton__line card-skeleton__line--short" />
            <span className="card-skeleton__line card-skeleton__line--title" />
            <span className="card-skeleton__line" />
            <span className="card-skeleton__line" />
            <span className="card-skeleton__line card-skeleton__line--mid" />
          </div>
        </div>
      ))}
    </div>
  );
}
