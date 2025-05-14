"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirectMessage, setRedirectMessage] = useState("Carregando...");

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirecionar com base no papel do usuário
        if (user.role === "admin") {
          setRedirectMessage("Redirecionando para o painel de administração...");
          router.push("/admin");
        } else if (user.role === "judge") {
          setRedirectMessage("Redirecionando para o painel de jurado...");
          router.push("/judge");
        } else {
          setRedirectMessage("Redirecionando para o painel de participante...");
          router.push("/participant");
        }
      } else {
        // Se não estiver autenticado, redirecionar para a página de login
        setRedirectMessage("Redirecionando para a página de login...");
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Mostrar um indicador de carregamento enquanto verifica a autenticação
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Ctrl Day Arena</h1>
        <p className="text-gray-600 mb-4">{redirectMessage}</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      </div>
    </div>
  );
}
