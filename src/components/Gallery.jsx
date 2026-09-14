import { LogoMark } from './LogoMark';
import { downloadPng, downloadSvg } from '../lib/export';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function Gallery({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="gallery-empty">
        <h3>No saved logos yet</h3>
        <p>
          Design a logo in the studio, then hit <strong>Save</strong> to add it to your gallery.
        </p>
      </div>
    );
  }
  return (
    <div className="gallery">
      {items.map((item) => (
        <article className="gallery-card" key={item.id}>
          <div className="gallery-art">
            <LogoMark cfg={item.cfg} theme="light" />
          </div>
          <div className="gallery-meta">
            <strong>{item.cfg.name || 'Untitled'}</strong>
            <span>{formatDate(item.createdAt)}</span>
          </div>
          <div className="gallery-actions">
            <button onClick={() => onEdit(item)}>Edit</button>
            <button onClick={() => downloadSvg(item.cfg, 'light')}>SVG</button>
            <button onClick={() => downloadPng(item.cfg, 'light')}>PNG</button>
            <button className="danger" onClick={() => onDelete(item.id)} aria-label="Delete">
              ✕
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
