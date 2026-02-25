export const metadata = {
  title: 'Valentine Vibes 💘',
  description: 'A cute, playful Valentine mini-site.'
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
