import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  /** Botón o enlace opcional, por ejemplo "Limpiar filtros" */
  action?: ReactNode;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
