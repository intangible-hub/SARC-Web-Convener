/**
 * Navbar - top bar with logo, user info, role badge, utility icons, and logout action.
 */

'use client';

import { useRouter } from 'next/navigation';
import { clearSession } from '@/lib/auth';
import api from '@/lib/api';
import { useToast } from './Toast';
import { Bell, Moon, Menu, LogOut } from 'lucide-react';

export default function Navbar({ user, onHamburger }) {
  const router = useRouter();
  const toast = useToast();

  async function handleLogout() {
    try {
      await api.post('/auth/logout/', {
        refresh_token: localStorage.getItem('refresh_token'),
      });
    } catch {}
    clearSession();
    toast('Logged out successfully', 'info');
    router.push('/login');
  }

  return (
    <header className="navbar">
      <div className="flex items-center gap-3">
        <button
          className="btn btn-secondary btn-sm md:hidden"
          onClick={onHamburger}
          style={{ padding: '4px 8px', border: '1px solid var(--border-color)', background: 'transparent' }}
          id="hamburger-btn"
        >
          <Menu size={16} />
        </button>
        <span className="navbar-logo md:hidden">
          SARC <span>EventHub</span>
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3" style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
            <span className={user.role === 'admin' ? 'badge badge-admin' : 'badge badge-student'}>
              {user.role === 'admin' ? 'Admin Ops' : 'Student'}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {user.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              className="btn btn-secondary btn-sm"
              style={{ background: 'transparent', border: 'none', padding: '4px', color: 'var(--text-secondary)' }}
            >
              <Bell size={15} />
            </button>
            <button 
              className="btn btn-secondary btn-sm"
              style={{ background: 'transparent', border: 'none', padding: '4px', color: 'var(--text-secondary)' }}
            >
              <Moon size={15} />
            </button>
            <button 
              className="btn btn-danger btn-sm" 
              onClick={handleLogout} 
              id="logout-btn"
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
