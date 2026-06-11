import { NotificateProvider } from '../contexts/notificate/notificate';
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css" /> */}
      </head>
      <body className="">
        <NotificateProvider>
          {children}
        </NotificateProvider>
      </body>

      {/* <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script> */}
    </html>
  );
}
