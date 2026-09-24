import './globals.css';

export const metadata = {
  title: 'QuadTrack — 4 Parallel Task Boards',
  description: 'Manage 4 parallel to-do workflows seamlessly with real-time local storage.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#0b0f19] text-slate-100">{children}</body>
    </html>
  );
}
