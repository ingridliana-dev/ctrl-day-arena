"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Ctrl Day Arena</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/")
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-100 hover:bg-indigo-500"
              }`}
            >
              Início
            </Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/admin")
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-100 hover:bg-indigo-500"
                    }`}
                  >
                    Administração
                  </Link>
                )}

                {user.role === "participant" && (
                  <Link
                    href="/participant"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/participant")
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-100 hover:bg-indigo-500"
                    }`}
                  >
                    Meus Trabalhos
                  </Link>
                )}

                {user.role === "judge" && (
                  <Link
                    href="/judge"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/judge")
                        ? "bg-indigo-700 text-white"
                        : "text-indigo-100 hover:bg-indigo-500"
                    }`}
                  >
                    Avaliações
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/dashboard")
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/profile")
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  Perfil
                </Link>

                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-500"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/login")
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/register")
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  Registrar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-500 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "bg-indigo-700 text-white"
                : "text-indigo-100 hover:bg-indigo-500"
            }`}
          >
            Início
          </Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/admin")
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  Administração
                </Link>
              )}

              {user.role === "participant" && (
                <Link
                  href="/participant"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/participant")
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  Meus Trabalhos
                </Link>
              )}

              {user.role === "judge" && (
                <Link
                  href="/judge"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive("/judge")
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500"
                  }`}
                >
                  Avaliações
                </Link>
              )}

              <Link
                href="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/dashboard")
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/profile")
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                Perfil
              </Link>

              <button
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-500"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/login")
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive("/register")
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-100 hover:bg-indigo-500"
                }`}
              >
                Registrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
