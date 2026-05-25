/**
 * Home page - redirect to /events or /login based on auth state.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(isAuthenticated() ? '/events' : '/login');
  }, []);
  return null;
}
