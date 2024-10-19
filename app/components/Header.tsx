"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [isMobile, setIsMobile] = useState(true);
  const [isMenuActive, setIsMenuActive] = useState(false);

  const router = useRouter();

  const pathname = usePathname();
  const links = [
    { name: "Accueil", href: "/home" },
    { name: "Hébergements", href: "/hosting" },
    { name: "Activités", href: "/activity" },
    { name: "Événements", href: "/event" },
    { name: "Contact", href: "/contact" },
  ];

  const handleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const displaySearchInput = () => {
    return (
      !pathname.startsWith("/signin") &&
      !pathname.startsWith("/contact") &&
      !pathname.startsWith("/login") &&
      !pathname.startsWith("/register") &&
      !pathname.startsWith("/hosting/add") &&
      !pathname.startsWith("/hosting/edit")
    );
  };
  const signOut = () => {
    window.sessionStorage.removeItem("token");
    window.localStorage.removeItem("token");
    router.push("/home");
    handleMenu();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header>
        <div className="md:px-20 lg:px-40 xl:px-60 flex justify-between items-center bg-lightGreen py-2 px-4 h-[50px]">
          <h1 className="text-xl font-bold">
            <Link href="/home">Forest</Link>
          </h1>
          {isMobile ? (
            <button onClick={handleMenu} className="flex z-30">
              <i
                className={
                  isMenuActive ? "fa-solid fa-xmark" : "fa-solid fa-bars"
                }
              ></i>
            </button>
          ) : (
            ""
          )}
          <nav
            className={
              !isMobile
                ? "flex"
                : isMenuActive
                  ? "absolute top-0 left-0 flex flex-col z-20 w-full h-full py-2 px-4 bg-secondary"
                  : "hidden"
            }
          >
            <ul className={!isMobile ? "flex" : ""}>
              {links.map((link, index) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li
                    key={index}
                    className={isMobile ? "mb-2" : "ml-3"}
                    onClick={handleMenu}
                  >
                    <Link
                      href={link.href}
                      className={isActive ? "font-bold" : ""}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
              {window.sessionStorage.getItem("token") ||
              window.localStorage.getItem("token") ? (
                <li
                  className={"cursor-pointer " + (isMobile ? "mb-2" : "ml-3")}
                  onClick={signOut}
                >
                  Déconnexion
                </li>
              ) : (
                <li className={isMobile ? "mb-2" : "ml-3"} onClick={handleMenu}>
                  <Link href="/login">Connexion</Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
        {displaySearchInput() ? (
          <div className="md:px-20 lg:px-60 xl:px-96 py-2 px-4">
            <form className="flex justify-center w-full relative">
              <input
                type="text"
                className="w-full rounded-md border-[1px] border-solid border-lightGrey px-2 py-1 shadow-sm"
              />
              <button
                type="button"
                className="absolute top-[50%] right-2 translate-y-[-50%] text-primary"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        ) : (
          ""
        )}
      </header>
    </>
  );
}
