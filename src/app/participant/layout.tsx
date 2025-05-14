"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/shared/Navbar";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "participant")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user || user.role !== "participant") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Área do Participante</h2>
          </div>
          <nav className="mt-4">
            <ul>
              <li>
                <a
                  href="/participant"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/participant/competitions"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Competições
                </a>
              </li>
              <li>
                <a
                  href="/participant/submissions"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Meus Trabalhos
                </a>
              </li>
              <li>
                <a
                  href="/participant/results"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Resultados
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
