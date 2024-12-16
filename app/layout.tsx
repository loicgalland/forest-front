import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/Header";
import { AuthProvider } from "./services/AuthContext";

export const metadata: Metadata = {
  title: "Forest",
  description:
    "Venez réserver votre séjour éco-responsable dans le Gers. Grâce à Forest vous pourrez découvrir un lieu" +
    " préservé et participer à des activités ou a des événements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body className="text-text bg-secondary box-border relative font-light ">
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
