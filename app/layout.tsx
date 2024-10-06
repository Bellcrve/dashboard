import { Navbar } from '@/components/Navbar';
import './globals.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/viva-light/theme.css';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { Logo } from '@/components/Logo';
export const metadata = {
  title: 'bellcrve',
  description: 'Distributed Monte Carlo Options Pricing',
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
            <Logo color="white" />
            {children}
          </PrimeReactProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
