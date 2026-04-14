import { Link } from 'react-router-dom';
import './EmptyState.css';

export default function EmptyState({ icon: Icon, title, subtitle, actionText, actionTo }) {
  return (
    <div className="empty-state-container">
      {Icon && (
        <div className="empty-state-icon-wrap">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <h2 className="empty-state-title">{title}</h2>
      {subtitle && <p className="empty-state-subtitle">{subtitle}</p>}
      {actionText && actionTo && (
        <Link to={actionTo} className="btn btn-primary btn-lg empty-state-btn">
          {actionText}
        </Link>
      )}
    </div>
  );
}
