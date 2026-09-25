import './globals.css';

export const metadata = {
  title: 'QuadTrack — Parallel Multi-Lane Task Board',
  description: 'Manage multiple parallel to-do workflows seamlessly with real-time local storage.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0b0f19] text-slate-100">{children}</body>
    </html>
  );
}
