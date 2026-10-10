'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { loginAdmin } from '@/app/actions/settings';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const res = await loginAdmin(formData);
      if (res.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res.error || 'Failed to authenticate');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col justify-center items-center px-4 -mt-10 sm:-mt-16">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-[#F5C518] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Menu</span>
        </Link>

        {/* Card */}
        <div className="bg-[#171717] border border-neutral-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#F5C518] flex items-center justify-center text-black mb-3 shadow-lg shadow-[#F5C518]/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Crazy Bites <span className="text-[#F5C518]">Admin</span>
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Sign in to manage categories, items, and prices
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@crazybites.com"
                  className="w-full ps-10 pe-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full ps-10 pe-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[#F5C518]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#F5C518] hover:bg-[#e0b314] text-black font-black uppercase tracking-wider text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Helper hint for demo */}
          <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
              <Sparkles className="w-3 h-3 text-[#F5C518]" />
              <span>Demo password: <strong className="text-[#F5C518]">admin123</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
