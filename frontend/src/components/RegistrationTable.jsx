/**
 * RegistrationTable - displays list of registrations.
 * Styled with thin border dividers, status highlights, and operations action buttons.
 */

import StatusBadge from './StatusBadge';
import { ClipboardList, Check, X } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function RegistrationTable({ registrations, isAdmin, onAccept, onReject }) {
  if (!registrations || registrations.length === 0) {
    return (
      <div className="empty-state" style={{ borderStyle: 'solid' }}>
        <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <ClipboardList size={38} style={{ color: 'var(--sarc-teal)', opacity: 0.6 }} />
        </div>
        <h3>No registrations found</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
          {isAdmin ? 'No operations match this filter.' : 'You have not registered for any events yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}>#</th>
            {isAdmin && <th>Student</th>}
            <th>Event Details</th>
            <th>Registration Date</th>
            <th style={{ width: '120px' }}>Status</th>
            {isAdmin && <th style={{ width: '180px' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg, idx) => (
            <tr key={reg.id}>
              <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{String(idx + 1).padStart(2, '0')}</td>
              {isAdmin && (
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{reg.user?.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: '2px' }}>{reg.user?.email}</div>
                </td>
              )}
              <td>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{reg.event?.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: '2px' }}>{reg.event?.location}</div>
              </td>
              <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                {formatDate(reg.registered_at)}
              </td>
              <td>
                <StatusBadge status={reg.status} />
              </td>
              {isAdmin && (
                <td>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      disabled={reg.status === 'accepted'}
                      onClick={() => onAccept(reg.id)}
                      style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Check size={12} />
                      <span>Accept</span>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={reg.status === 'rejected'}
                      onClick={() => onReject(reg.id)}
                      style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <X size={12} />
                      <span>Reject</span>
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
