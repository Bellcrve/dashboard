import { Navbar } from '@/components/Navbar';
import './globals.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/viva-light/theme.css';
import { WebSocketProvider } from '@/context/WebSocketContext';

export const metadata = {
  title: 'Distributed Monte Carlo Options Pricing',
  description: 'Run simulations on multiple computers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen overflow-scroll bg-primary">
        <WebSocketProvider>
          <PrimeReactProvider>
            <Navbar />
            {children}
          </PrimeReactProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
