"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCompetitions } from "@/hooks/useCompetitions";
import { formatDate } from "@/lib/helpers";

export default function AdminDashboard() {
  const { competitions, loading, error } = useCompetitions();
  const [activeCompetitions, setActiveCompetitions] = useState(0);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [pendingEvaluations, setPendingEvaluations] = useState(0);

  useEffect(() => {
    // Contar competições ativas
    const active = competitions.filter(
      (comp) => comp.status === "active" || comp.status === "judging"
    ).length;
    setActiveCompetitions(active);

    // Aqui você poderia fazer chamadas adicionais para obter estatísticas
    // como número total de submissões e avaliações pendentes
    // Por enquanto, usaremos valores fictícios
    setTotalSubmissions(competitions.length * 5);
    setPendingEvaluations(competitions.length * 2);
  }, [competitions]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Administrativo</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Competições Ativas</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {activeCompetitions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Total de Submissões</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {totalSubmissions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Avaliações Pendentes</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {pendingEvaluations}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de competições recentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Competições Recentes</h2>
          <Link
            href="/admin/competitions/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition"
          >
            Nova Competição
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">
              Erro ao carregar competições: {error.message}
            </p>
          </div>
        ) : competitions.length === 0 ? (
          <p className="text-gray-500 py-4">
            Nenhuma competição encontrada. Crie sua primeira competição!
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
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Submissões até
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
                {competitions.slice(0, 5).map((competition) => (
                  <tr key={competition.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {competition.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          competition.status === "active"
                            ? "bg-green-100 text-green-800"
                            : competition.status === "judging"
                            ? "bg-yellow-100 text-yellow-800"
                            : competition.status === "completed"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {competition.status === "active"
                          ? "Ativa"
                          : competition.status === "judging"
                          ? "Em Avaliação"
                          : competition.status === "completed"
                          ? "Concluída"
                          : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(competition.submission_end_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/competitions/${competition.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Detalhes
                      </Link>
                      <Link
                        href={`/admin/competitions/${competition.id}/edit`}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {competitions.length > 5 && (
          <div className="mt-4 text-right">
            <Link
              href="/admin/competitions"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              Ver todas as competições →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
