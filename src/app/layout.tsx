import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calendário de Projetos",
  description: "Calendário alimentado via Google Sheets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
