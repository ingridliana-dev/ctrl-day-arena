"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase, User } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário autenticado
    const checkUser = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Buscar informações adicionais do usuário no banco de dados
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser(data as User);
      }

      setLoading(false);
    };

    checkUser();

    // Configurar listener para mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Buscar informações adicionais do usuário no banco de dados
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setUser(data as User);
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: string
  ) => {
    try {
      console.log("Iniciando processo de registro para:", email);

      // Primeiro, registrar o usuário na autenticação do Supabase
      const { error: authError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (authError || !data.user) {
        console.error("Erro na autenticação:", authError);
        return { error: authError };
      }

      console.log("Usuário criado na autenticação:", data.user.id);

      // Fazer login com o usuário recém-criado para poder inserir na tabela users
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Erro ao fazer login após registro:", signInError);
        return { error: signInError };
      }

      console.log("Login realizado com sucesso após registro");

      // Adicionar informações adicionais do usuário no banco de dados
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          name,
          role,
        },
      ]);

      if (dbError) {
        console.error("Erro ao inserir na tabela users:", dbError);
        console.error(
          "Detalhes do erro:",
          dbError.message,
          dbError.details,
          dbError.hint
        );
      } else {
        console.log("Usuário inserido na tabela users com sucesso");
      }

      // Fazer logout para que o usuário faça login novamente na tela de login
      await supabase.auth.signOut();

      return { error: dbError, user: data.user };
    } catch (error) {
      console.error("Erro inesperado no registro:", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
