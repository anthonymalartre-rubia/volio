// Redirection /pricing → /#pricing (ancre dans la landing).
//
// Plusieurs Link href="/pricing" pointaient vers du 404 (notamment
// UpgradeCrmModal et /app/crm). On garde une URL canonique "/pricing"
// pour les CTA, les emails et les meta-descriptions, et on redirige
// côté serveur vers la section ancre de la landing.

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function PricingRedirect() {
  redirect('/#pricing');
}
