import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { AuthProvider } from "./services/AuthContext";
import { Footer } from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "Forest | Réservation hébergement",
  description:
    "Venez réserver votre séjour éco-responsable dans le Gers. Grâce à Forest vous pourrez découvrir un lieu" +
    " préservé et participer à des activités ou a des événements.",
  openGraph: {
    title: "Réservation hébergement - Forest",
    description:
      "Venez réserver votre séjour éco-responsable dans le Gers. Découvrez des hébergements écoresponsables.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className="text-text bg-secondary box-border relative font-light h-[100vh] ">
        <AuthProvider>
          <div className="relative overflow-x-hidden h-full flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
