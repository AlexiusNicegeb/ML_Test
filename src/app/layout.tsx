import type { Metadata } from "next";
import { PublicEnvScript } from "next-runtime-env";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProviders } from "./providers/UserProviders";
import { Footer } from "./ui/components/Footer";
import { UserHeader } from "./ui/components/UserHeader";
import "./ui/styles/globals.scss";

import { Barlow_Semi_Condensed } from "next/font/google";
import { ValeProvider } from "./context/vale/ValeContext";

export const metadata: Metadata = {
  title: "Matura auf Lock",
  description: "Matura auf Lock",
};

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={barlowSemiCondensed.className}>
      <head>
        <PublicEnvScript />
      </head>
      <body>
        <UserProviders>
          <ValeProvider>
            <UserHeader />
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#bfdbfe] via-[#93c5fd] to-[#7dd3fc] items-center pb-24 relative">
              {children}
              <div className="bg-overlay" />
            </div>
            <Footer />
          </ValeProvider>
        </UserProviders>
        <ToastContainer />
      </body>
    </html>
  );
}
