/**
 * StatusBadge - renders colored pill badges for event/registration statuses.
 */

export default function StatusBadge({ status }) {
  const map = {
    pending:   'badge badge-pending',
    accepted:  'badge badge-accepted',
    rejected:  'badge badge-rejected',
    cancelled: 'badge badge-cancelled',
    draft:     'badge badge-draft',
    published: 'badge badge-published',
  };

  const labels = {
    pending:   'Pending',
    accepted:  'Accepted',
    rejected:  'Rejected',
    cancelled: 'Cancelled',
    draft:     'Draft',
    published: 'Published',
  };

  return (
    <span className={map[status] || 'badge badge-draft'}>
      {labels[status] || status}
    </span>
  );
}
