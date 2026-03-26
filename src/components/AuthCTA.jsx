'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function NavAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setIsLoggedIn(!!user);
      });
    }
  }, []);

  if (isLoggedIn) {
    return (
      <Link
        href="/dashboard"
        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-all"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="px-4 py-2 text-sm text-[#a1a1aa] hover:text-white transition"
      >
        Se connecter
      </Link>
      <Link
        href="/signup"
        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-all"
      >
        Essai gratuit
      </Link>
    </>
  );
}

export function HeroCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setIsLoggedIn(!!user);
      });
    }
  }, []);

  const href = isLoggedIn ? '/dashboard' : '/signup';
  const text = isLoggedIn ? 'Accéder au dashboard' : 'Commencer gratuitement';

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-base font-semibold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40"
    >
      {text}
      <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}

export function FooterCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setIsLoggedIn(!!user);
      });
    }
  }, []);

  const href = isLoggedIn ? '/dashboard' : '/signup';
  const text = isLoggedIn ? 'Accéder au dashboard' : 'Commencer gratuitement';

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-lg font-semibold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40"
    >
      {text}
      <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
