import { Navbar } from '@/components/Navbar';

export default function DevlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-secondary-text h-screen w-screen overflow-scroll bg-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
