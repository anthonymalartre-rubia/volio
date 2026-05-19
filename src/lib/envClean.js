/**
 * Nettoie une variable d'environnement des artefacts de copy-paste courants :
 * - Vrais espaces/sauts de ligne (	,
,, espace…) → trim()
 * - Littéraux backslash-n / backslash-r / backslash-t (2 caractères chacun)
 *   tapés ou collés par erreur dans l'UI Vercel.
 * - Guillemets entourants éventuels.
 *
 * Cause typique : copy-paste d'une clé depuis un terminal qui affiche le
 * dernier \n, l'utilisateur Ctrl+C une zone qui inclut ce caractère, puis
 * Vercel le stocke tel quel.
 *
 * À utiliser SYSTÉMATIQUEMENT sur tout secret/ID externe (Stripe, Anthropic,
 * Google, Supabase, etc.) lu via process.env.
 */
export function cleanEnv(value) {
  if (value == null) return value;
  let v = String(value);
  // 1. Strip enclosing quotes if any
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  // 2. Strip literal escape sequences that may have leaked (in BOTH directions)
  v = v.replace(/(\\[nrt]\s*)+$/g, ''); // trailing \n \r \t literals (possibly repeated)
  v = v.replace(/^(\s*\\[nrt])+/g, ''); // leading
  // 3. Real whitespace (newlines, tabs, spaces)
  return v.trim();
}
