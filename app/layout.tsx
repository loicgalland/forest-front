import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { AuthProvider } from "./services/AuthContext";

export const metadata: Metadata = {
  title: "Forest",
  description:
    "Forest est un site de réservation de location de vacance écoresponsable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          title="Forest"
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="text-text bg-secondary box-border relative">
        <AuthProvider>
          <div className="relative overflow-x-hidden ">
            <Header />
            <div>{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
