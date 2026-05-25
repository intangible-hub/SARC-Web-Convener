/**
 * Root layout - wraps all pages with global styles, toast provider.
 * Auth-aware: shows sidebar+navbar for logged-in routes, bare for auth pages.
 */

'use client';

import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '@/lib/auth';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const AUTH_ROUTES = ['/login', '/register'];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getUser();
    setUser(u);
  }, [pathname]);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (!mounted) return <html lang="en"><body /></html>;

  if (isAuthRoute) {
    return (
      <html lang="en">
        <head>
          <title>SARC EventHub</title>
          <meta name="description" content="SARC IIT Bombay Event Management Portal" />
        </head>
        <body style={{ position: 'relative', overflowX: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
            zIndex: 0,
            pointerEvents: 'none'
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <ToastProvider>{children}</ToastProvider>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>SARC EventHub</title>
        <meta name="description" content="SARC IIT Bombay Event Management Portal" />
      </head>
      <body>
        <ToastProvider>
          <div className="app-layout">
            <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content">
              <Navbar user={user} onHamburger={() => setSidebarOpen(true)} />
              <main style={{ padding: '20px 24px', flex: 1, position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  top: '-10%',
                  right: '10%',
                  width: '400px',
                  height: '400px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.04) 0%, transparent 70%)',
                  zIndex: -1,
                  pointerEvents: 'none'
                }} />
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
