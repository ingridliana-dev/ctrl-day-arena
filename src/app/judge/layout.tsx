"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/shared/Navbar";

export default function JudgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "judge")) {
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

  if (!user || user.role !== "judge") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h2 className="text-xl font-semibold">Área do Jurado</h2>
          </div>
          <nav className="mt-4">
            <ul>
              <li>
                <a
                  href="/judge"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/judge/assignments"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Minhas Atribuições
                </a>
              </li>
              <li>
                <a
                  href="/judge/evaluations"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Avaliações Realizadas
                </a>
              </li>
              <li>
                <a
                  href="/judge/pending"
                  className="block py-2 px-4 hover:bg-gray-700 transition"
                >
                  Pendentes
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
