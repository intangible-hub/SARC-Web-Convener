/**
 * Sidebar navigation component.
 * Shows role-based links with lucide icons and custom user profile widget.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, ClipboardList, Shield } from 'lucide-react';

const studentLinks = [
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/dashboard', label: 'My Registrations', icon: ClipboardList },
];

const adminLinks = [
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/dashboard', label: 'My Registrations', icon: ClipboardList },
  { href: '/admin', label: 'Admin Panel', icon: Shield },
];

export default function Sidebar({ user, isOpen, onClose }) {
  const pathname = usePathname();
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            SARC <span style={{ color: 'var(--sarc-blue)', fontSize: 13, fontWeight: 500 }}>EventHub</span>
          </span>
          <span className="subtitle">IIT Bombay</span>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={16} style={{ opacity: isActive ? 1 : 0.7 }} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--sarc-blue) 0%, var(--sarc-teal) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '12px',
              color: '#ffffff',
              flexShrink: 0
            }}>
              {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
