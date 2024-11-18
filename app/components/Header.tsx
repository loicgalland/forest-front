"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/services/AuthContext";
import { AuthRepository } from "@/app/repository/AuthRepository";
import UserIcon from "@/app/assets/images/svg/userIcon.svg";
import UserIconWhite from "@/app/assets/images/svg/userIconWhite.svg";
import BurgerMenu from "@/app/assets/images/svg/burgerMenu.svg";
import CloseMenu from "@/app/assets/images/svg/menuClose.svg";

export function Header() {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
  const [userMenu, setUserMenu] = useState<boolean>(false);
  const { setUserId } = useAuth();
  const { userRole, setUserRole } = useAuth();
  const userMenuRef = useRef<HTMLUListElement | null>(null);

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
    if (!isMenuActive) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };

  const toggleUserMenu = () => {
    setUserMenu(true);
  };

  const getUserRole = async () => {
    const response = await AuthRepository.getUserRole();
    setUserRole(response.data.role);
    setUserId(response.data.userId);
  };

  const signOut = async () => {
    const response = await AuthRepository.logout();
    if (response.status === 200) {
      window.localStorage.removeItem("userConnected");
      router.push("/home");
      getUserRole();
      setUserRole(null);
      setUserId(null);
      setUserMenu(false);
      handleMenu();
    }
  };
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target as Node)
    ) {
      setUserMenu(false);
    }
  };

  useEffect(() => {
    getUserRole();
    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header>
        <div className=" md:px-20 lg:px-40 xl:px-60 flex justify-between items-center bg-beige h-[80px] font-bold text-xl font-happy">
          <div className="w-full relative flex justify-between items-center">
            <h1 className="text-[30px] font-bold uppercase py-2">
              <Link
                href="/home"
                onClick={() => {
                  setUserMenu(false);
                }}
              >
                Forest
              </Link>
            </h1>
            {isMobile ? (
              <button onClick={handleMenu} className="flex z-30 py-2 px-4">
                {isMenuActive ? <CloseMenu /> : <BurgerMenu />}
              </button>
            ) : (
              ""
            )}
            <nav
              className={
                !isMobile
                  ? "flex"
                  : isMenuActive
                    ? "absolute top-[-20px] left-0 flex flex-col z-20 w-full h-[100vh] py-2 px-4 bg-beige justify-center"
                    : "hidden"
              }
            >
              <ul
                className={
                  !isMobile
                    ? "flex items-center"
                    : " flex flex-col items-center"
                }
              >
                {links.map((link, index) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <li
                      key={index}
                      className="mt-6 md:ml-4 md:mt-0 text-[19px] md:text-[15px]"
                      onClick={handleMenu}
                    >
                      <Link
                        href={link.href}
                        className={isActive ? "text-primary" : ""}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
                <li
                  className={"cursor-pointer " + (isMobile ? "mt-2" : "ml-6")}
                >
                  {!isMobile ? (
                    <div
                      onClick={toggleUserMenu}
                      className={
                        "w-[40px] h-[40px] rounded-full border-2 border-primary flex justify-center items-center " +
                        (window.localStorage.getItem("userConnected") &&
                        userRole
                          ? " bg-success"
                          : "")
                      }
                    >
                      {" "}
                      {window.localStorage.getItem("userConnected") &&
                      userRole ? (
                        <UserIconWhite />
                      ) : (
                        <UserIcon />
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  {window.localStorage.getItem("userConnected") && userRole ? (
                    <ul
                      ref={userMenuRef}
                      className={
                        isMobile
                          ? "static pt-2 mt-[70px]"
                          : userMenu
                            ? "absolute bottom-0 transform translate-y-full right-0 bg-beige rounded-b-md px-6" +
                              " text-[15px]" +
                              " z-10" +
                              " pt-6"
                            : "hidden"
                      }
                    >
                      <li className="cursor-pointer mt-6 pt-1 md:mt-0 md:mb-2 text-center">
                        <Link
                          href={"/profile"}
                          onClick={() => {
                            setUserMenu(false);
                          }}
                        >
                          Mon profil
                        </Link>
                      </li>
                      <li
                        className="cursor-pointer mt-6 pt-1 md:mt-0 md:mb-2 text-center"
                        onClick={() => {
                          signOut();
                          setUserMenu(false);
                        }}
                      >
                        Déconnexion
                      </li>
                    </ul>
                  ) : (
                    <ul
                      ref={userMenuRef}
                      className={
                        isMobile
                          ? "static mt-[70px]"
                          : userMenu
                            ? "absolute bottom-0 transform translate-y-full right-0 bg-beige rounded-b-md px-6" +
                              " text-[14px]" +
                              " z-10" +
                              " pt-6"
                            : "hidden"
                      }
                    >
                      <li className="mt-6 md:mt-0 md:mb-2 text-center">
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
                      <li className="mt-6 md:mt-0 md:mb-2 text-center bg-success text-secondary w-full rounded-[10px] px-4">
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
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
