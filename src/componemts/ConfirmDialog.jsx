import './confirmDialog.css';

function toneClass(tone) {
  if (tone === 'danger') return 'confirm-dialog__confirm--danger';
  if (tone === 'success') return 'confirm-dialog__confirm--success';
  return 'confirm-dialog__confirm--default';
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
  busy = false,
}) {
  if (!open) return null;

  return (
    <div className="confirm-dialog__backdrop" onClick={busy ? undefined : onCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`confirm-dialog__accent confirm-dialog__accent--${tone}`} />
        <div className="confirm-dialog__body">
          <p className="confirm-dialog__eyebrow">Please Confirm</p>
          <h3 id="confirm-dialog-title">{title}</h3>
          <p className="confirm-dialog__message">{message}</p>
        </div>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__cancel"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-dialog__confirm ${toneClass(tone)}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
