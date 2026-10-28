import './Ui.css';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Cargando apartamentos…' }: LoaderProps) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <p className="loader__text">{message}</p>
    </div>
  );
}
