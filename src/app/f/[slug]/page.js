// ─────────────────────────────────────────────────────────────────────
// /f/[slug] — Renderer public Volia Formulaires (Sprint F2)
// ─────────────────────────────────────────────────────────────────────
// Server component minimal :
//   1. Récupère le form via RPC get_published_form (bypass RLS, ne retourne
//      que les forms status='published').
//   2. Fetch des form_fields (la RPC ne les retourne pas).
//   3. Incrémente le view_count (fire-and-forget).
//   4. Render le wrapper (wordmark + footer Volia) + <FormRenderer/>.
//   5. Si ?embed=true → mode embed (ultra-minimal, transparent, headers
//      autorisant frame-ancestors *).
//
// SEO : noindex (les forms persos ne doivent pas être indexés).
// ─────────────────────────────────────────────────────────────────────

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import FormRenderer from '@/components/forms/FormRenderer';

// Toujours rendre dynamiquement : les forms publiés évoluent, on ne
// veut pas de cache statique sur le slug (sinon update de schema invisible).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function loadForm(slug) {
  const supabase = getSupabaseAdmin();

  // 1. RPC SECURITY DEFINER → bypass RLS, retourne uniquement si published
  const { data: rows, error } = await supabase.rpc('get_published_form', {
    p_slug: slug,
  });

  if (error) {
    console.error('[/f/[slug]] get_published_form error', error);
    return null;
  }

  const form = Array.isArray(rows) ? rows[0] : rows;
  if (!form) return null;

  // 2. Fetch des fields (la RPC ne les inclut pas)
  const { data: fields, error: fieldsError } = await supabase
    .from('form_fields')
    .select(
      'id, field_key, field_type, label, placeholder, help_text, required, position, page, options, validation, conditional_logic'
    )
    .eq('form_id', form.id)
    .order('page', { ascending: true })
    .order('position', { ascending: true });

  if (fieldsError) {
    console.error('[/f/[slug]] fields fetch error', fieldsError);
  }

  return { ...form, fields: fields || [] };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const form = await loadForm(slug);
  if (!form) {
    return {
      title: 'Formulaire introuvable',
      robots: { index: false, follow: false },
    };
  }
  return {
    title: form.name,
    description: form.description || undefined,
    robots: { index: false, follow: false },
    openGraph: {
      title: form.name,
      description: form.description || 'Formulaire propulsé par Volia',
      type: 'website',
    },
  };
}

export default async function FormRendererPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = (await searchParams) || {};
  const isEmbed = sp.embed === 'true' || sp.embed === '1';

  const form = await loadForm(slug);
  if (!form) {
    notFound();
  }

  // Fire-and-forget view_count increment.
  // Pas d'await pour ne pas bloquer le render. Best-effort.
  (async () => {
    try {
      const supabase = getSupabaseAdmin();
      await supabase.rpc('increment_form_view_count', { p_form_id: form.id });
    } catch (err) {
      console.warn('[/f/[slug]] view_count increment failed', err);
    }
  })();

  // Lit l'headers (utile pour referer si on veut faire de l'analytics V2)
  try {
    await headers();
  } catch {}

  // Mode embed : pas de chrome, fond transparent
  if (isEmbed) {
    return (
      <div className="min-h-screen w-full bg-transparent">
        <FormRenderer form={form} slug={slug} isEmbed />
      </div>
    );
  }

  // Mode standalone : wordmark + form + footer
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-zinc-50 to-white text-zinc-900">
      {/* Wordmark subtil */}
      <header className="w-full px-4 sm:px-6 py-5 flex items-center justify-center">
        <Link
          href="https://volia.fr?utm_source=form_header&utm_medium=referral"
          target="_blank"
          rel="noopener"
          className="text-xs font-semibold tracking-wider text-zinc-400 hover:text-pink-600 transition-colors"
        >
          volia
        </Link>
      </header>

      {/* Form */}
      <main className="w-full px-4 sm:px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <FormRenderer form={form} slug={slug} />
        </div>
      </main>

      {/* Footer Powered by */}
      <footer className="w-full px-4 py-6 text-center">
        <Link
          href="https://volia.fr?utm_source=form_powered_by&utm_medium=referral"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-pink-600 transition-colors"
        >
          <span>Propulsé par</span>
          <span className="font-bold tracking-wider">Volia</span>
        </Link>
      </footer>
    </div>
  );
}
