import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Cancionero",
  description: "Gestor de canciones para músicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${firaCode.variable} font-sans antialiased bg-[#0B0E14] text-slate-200 h-screen overflow-hidden selection:bg-blue-500/30`}>
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 ml-64 h-full relative overflow-hidden">
            <div className="h-full w-full p-8 lg:p-12 overflow-y-auto">
              <div className="max-w-6xl mx-auto h-full">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
