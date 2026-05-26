'use client';

// Layout pour /notifications — wrappe avec AppShell (TopBar + ModuleSwitcher).

import AppShell from '@/components/AppShell';

export default function NotificationsLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
