import { useState, useEffect } from 'react';
import { supabase, Competition } from '@/lib/supabase';

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar todas as competições
  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCompetitions(data as Competition[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar uma competição específica
  const fetchCompetition = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('competitions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Competition;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Criar uma nova competição
  const createCompetition = async (competition: Omit<Competition, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('competitions')
        .insert([competition])
        .select();

      if (error) {
        throw error;
      }

      setCompetitions([...(data as Competition[]), ...competitions]);
      return data?.[0] as Competition;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar uma competição existente
  const updateCompetition = async (id: string, updates: Partial<Competition>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('competitions')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      setCompetitions(
        competitions.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp))
      );

      return data?.[0] as Competition;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Excluir uma competição
  const deleteCompetition = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('competitions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCompetitions(competitions.filter((comp) => comp.id !== id));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Carregar competições ao montar o componente
  useEffect(() => {
    fetchCompetitions();
  }, []);

  return {
    competitions,
    loading,
    error,
    fetchCompetitions,
    fetchCompetition,
    createCompetition,
    updateCompetition,
    deleteCompetition,
  };
}
