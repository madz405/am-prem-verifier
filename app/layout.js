import './globals.css';

export const metadata = {
  title: 'AM Prem Verifier V2.0',
  description: 'Sistem Verifikasi Akun Alight Motion Berbasis Web',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#FFFDF0] min-h-screen text-black">
        {children}
      </body>
    </html>
  );
}
