import { useState, useEffect } from 'react';
import { supabase, Category } from '@/lib/supabase';

export function useCategories(competitionId?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Carregar todas as categorias de uma competição
  const fetchCategories = async (compId?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('categories').select('*');
      
      // Se um ID de competição for fornecido, filtre por ele
      if (compId || competitionId) {
        query = query.eq('competition_id', compId || competitionId);
      }

      const { data, error } = await query.order('name');

      if (error) {
        throw error;
      }

      setCategories(data as Category[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar uma categoria específica
  const fetchCategory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Category;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Criar uma nova categoria
  const createCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select();

      if (error) {
        throw error;
      }

      setCategories([...(data as Category[]), ...categories]);
      return data?.[0] as Category;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar uma categoria existente
  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      setCategories(
        categories.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
      );

      return data?.[0] as Category;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Excluir uma categoria
  const deleteCategory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCategories(categories.filter((cat) => cat.id !== id));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Carregar categorias ao montar o componente, se um ID de competição for fornecido
  useEffect(() => {
    if (competitionId) {
      fetchCategories();
    }
  }, [competitionId]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
