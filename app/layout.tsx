import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StageAI — Virtual Home Staging",
  description: "Mobila virtualmente os teus imoveis com inteligencia artificial",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-gray-50 min-h-screen text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
