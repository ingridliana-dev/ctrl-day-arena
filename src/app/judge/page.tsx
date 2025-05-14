"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/helpers";

export default function JudgeDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [completedEvaluations, setCompletedEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJudgeData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Buscar atribuições do jurado
        const { data: assignmentsData, error: assignmentsError } = await supabase
          .from("judge_assignments")
          .select("*, categories(name, competition_id, competitions(name))")
          .eq("judge_id", user.id);

        if (assignmentsError) throw assignmentsError;
        setAssignments(assignmentsData || []);

        // Buscar submissões pendentes de avaliação
        // Esta é uma consulta complexa que pode precisar ser ajustada com base na estrutura real do banco de dados
        const { data: pendingData, error: pendingError } = await supabase
          .from("submissions")
          .select(`
            id, 
            title, 
            category_id, 
            categories(name, competition_id, competitions(name)),
            submission_date
          `)
          .in(
            "category_id",
            assignmentsData.map((a) => a.category_id)
          )
          .not(
            "id",
            "in",
            supabase
              .from("evaluations")
              .select("submission_id")
              .eq("judge_id", user.id)
          );

        if (pendingError) throw pendingError;
        setPendingSubmissions(pendingData || []);

        // Buscar avaliações já realizadas
        const { data: evaluationsData, error: evaluationsError } = await supabase
          .from("evaluations")
          .select(`
            id, 
            score, 
            created_at,
            submissions(id, title, category_id, categories(name))
          `)
          .eq("judge_id", user.id)
          .order("created_at", { ascending: false });

        if (evaluationsError) throw evaluationsError;
        setCompletedEvaluations(evaluationsData || []);
      } catch (err) {
        console.error("Erro ao carregar dados do jurado:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgeData();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard do Jurado</h1>

      {/* Boas-vindas */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Bem-vindo, {user?.name || "Jurado"}!
        </h2>
        <p className="text-gray-600">
          Aqui você pode visualizar e avaliar os trabalhos submetidos nas
          categorias atribuídas a você.
        </p>
      </div>

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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Categorias Atribuídas</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {assignments.length}
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Avaliações Pendentes</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {pendingSubmissions.length}
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Avaliações Concluídas</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {completedEvaluations.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissões pendentes */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Avaliações Pendentes</h2>
          <Link
            href="/judge/pending"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">
              Erro ao carregar dados: {error}
            </p>
          </div>
        ) : pendingSubmissions.length === 0 ? (
          <p className="text-gray-500 py-4">
            Não há submissões pendentes de avaliação.
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
                    Competição
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
                {pendingSubmissions.slice(0, 5).map((submission) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {submission.categories?.competitions?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/judge/evaluate/${submission.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Avaliar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Avaliações recentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Avaliações Recentes</h2>
          <Link
            href="/judge/evaluations"
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : completedEvaluations.length === 0 ? (
          <p className="text-gray-500 py-4">
            Você ainda não realizou nenhuma avaliação.
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
                    Trabalho
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
                    Nota
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data da Avaliação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedEvaluations.slice(0, 5).map((evaluation) => (
                  <tr key={evaluation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {evaluation.submissions?.title || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {evaluation.submissions?.categories?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {evaluation.score}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(evaluation.created_at)}
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
