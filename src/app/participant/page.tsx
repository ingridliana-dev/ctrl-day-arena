"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useCompetitions } from "@/hooks/useCompetitions";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/helpers";

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const { competitions, loading: loadingCompetitions } = useCompetitions();
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [error, setError] = useState(null);

  // Filtrar competições ativas
  const activeCompetitions = competitions.filter(
    (comp) => comp.status === "active"
  );

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;

      try {
        setLoadingSubmissions(true);
        const { data, error } = await supabase
          .from("submissions")
          .select("*, categories(name, competition_id)")
          .eq("participant_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setSubmissions(data || []);
      } catch (err) {
        console.error("Erro ao carregar submissões:", err);
        setError(err.message);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard do Participante</h1>

      {/* Boas-vindas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Bem-vindo, {user?.name || "Participante"}!
        </h2>
        <p className="text-gray-600">
          Aqui você pode visualizar competições disponíveis e gerenciar seus
          trabalhos submetidos.
        </p>
      </div>

      {/* Competições ativas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Competições Ativas</h2>
          <Link
            href="/participant/competitions"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Ver todas
          </Link>
        </div>

        {loadingCompetitions ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : activeCompetitions.length === 0 ? (
          <p className="text-gray-500 py-4">
            Não há competições ativas no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCompetitions.slice(0, 4).map((competition) => (
              <div
                key={competition.id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg mb-1">
                  {competition.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {competition.description?.substring(0, 100)}
                  {competition.description?.length > 100 ? "..." : ""}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    Submissões até: {formatDate(competition.submission_end_date)}
                  </span>
                  <Link
                    href={`/participant/competitions/${competition.id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Participar →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submissões recentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Meus Trabalhos Recentes</h2>
          <Link
            href="/participant/submissions"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Ver todos
          </Link>
        </div>

        {loadingSubmissions ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">Erro ao carregar submissões: {error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-gray-500 py-4">
            Você ainda não submeteu nenhum trabalho.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Título
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data de Submissão
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.slice(0, 5).map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {submission.categories?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.submission_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/participant/submissions/${submission.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Visualizar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
