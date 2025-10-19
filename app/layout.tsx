import type { ReactNode } from 'react';

import './globals.css';

export const metadata = {
  metadataBase: new URL('https://ms-portfolio.vercel.app'),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
