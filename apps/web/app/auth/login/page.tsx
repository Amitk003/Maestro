'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageTransition } from '../../../components/ui/PageTransition';

function LoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');

  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-purple-600 p-[1px] mx-auto">
              <div className="h-full w-full bg-zinc-950 rounded-[11px] flex items-center justify-center font-extrabold text-white text-lg">
                M
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-4">Maestro</h1>
            <p className="text-sm text-zinc-400 mt-1">Sign in to your restaurant</p>
          </div>

          <form action="/api/auth/login" method="POST">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Email</label>
                <input name="email" type="email" defaultValue="test@maestro.demo" placeholder="you@restaurant.com" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">Password</label>
                <input name="password" type="password" defaultValue="password123" placeholder="Enter password" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" required />
              </div>
              {errorParam && (
                <div className="text-xs text-rose-400 bg-rose-500/10 rounded-xl p-3 border border-rose-500/20">{errorParam}</div>
              )}
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-rose-500 py-3 text-xs font-bold text-white shadow-lg hover:brightness-110 transition">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950" />}>
      <LoginForm />
    </Suspense>
  );
}
