"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
  const [userMenu, setUserMenu] = useState<boolean>(false);

  const router = useRouter();

  const pathname = usePathname();
  const links = [
    { name: "Hébergements", href: "/hosting" },
    { name: "Activités", href: "/activity" },
    { name: "Événements", href: "/event" },
    { name: "Contact", href: "/contact" },
  ];

  const handleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const toggleUserMenu = () => {
    setUserMenu(!userMenu);
  };

  const signOut = () => {
    window.localStorage.removeItem("userConnected");
    router.push("/home");
    setUserMenu(false);
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
            <ul className={!isMobile ? "flex items-center" : ""}>
              {links.map((link, index) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <li
                    key={index}
                    className={isMobile ? "mt-2" : "ml-6"}
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
              <li
                className={
                  "cursor-pointer relative " + (isMobile ? "mt-2" : "ml-6")
                }
              >
                {!isMobile ? (
                  <div
                    className="w-[30px] h-[30px] rounded-full shadow flex justify-center items-center relative z-20"
                    onClick={toggleUserMenu}
                  >
                    <i className="fa-solid fa-user"></i>
                  </div>
                ) : (
                  ""
                )}

                <ul
                  className={
                    isMobile
                      ? "static bg-secondary border-t-[1px] border-t-text pt-2"
                      : userMenu
                        ? "absolute top-[35px] left-[-10px] bg-secondary rounded-b-md px-4 z-10 pt-2"
                        : "hidden"
                  }
                >
                  <li className="mb-2">
                    <Link
                      href="/login"
                      onClick={() => {
                        setUserMenu(false);
                        handleMenu();
                      }}
                    >
                      Connexion
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      href="/register"
                      onClick={() => {
                        setUserMenu(false);
                        handleMenu();
                      }}
                    >
                      Inscription
                    </Link>
                  </li>
                  {window.localStorage.getItem("userConnected") ? (
                    <li className="cursor-pointer mb-2 pt-1" onClick={signOut}>
                      Déconnexion
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
