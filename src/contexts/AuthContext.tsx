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
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any; user: User | null }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: string
  ) => Promise<{ error: any; user?: any }>;
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
    try {
      console.log("Tentando fazer login com:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro na autenticação:", error);
        return { error, user: null };
      }

      if (!data.user) {
        console.error("Login bem-sucedido, mas nenhum usuário retornado");
        return {
          error: new Error("Falha ao obter dados do usuário"),
          user: null,
        };
      }

      console.log("Login bem-sucedido para o usuário:", data.user.id);

      // Buscar informações adicionais do usuário no banco de dados
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (userError) {
        console.error("Erro ao buscar dados do usuário:", userError);
        return {
          error: userError,
          user: null,
        };
      }

      if (!userData) {
        console.error(
          "Usuário autenticado, mas não encontrado na tabela users"
        );

        // Tentar inserir o usuário na tabela users
        console.log("Tentando inserir usuário na tabela users");
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name || "Usuário",
            role: data.user.user_metadata.role || "participant",
          },
        ]);

        if (insertError) {
          console.error(
            "Erro ao inserir usuário na tabela users:",
            insertError
          );
          return {
            error: new Error(
              "Usuário autenticado, mas não encontrado na tabela users e não foi possível criá-lo"
            ),
            user: null,
          };
        }

        // Buscar o usuário recém-inserido
        const { data: newUserData, error: newUserError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (newUserError || !newUserData) {
          console.error("Erro ao buscar usuário recém-inserido:", newUserError);
          return {
            error:
              newUserError || new Error("Usuário não encontrado após inserção"),
            user: null,
          };
        }

        setUser(newUserData as User);
        return { error: null, user: newUserData };
      }

      console.log("Dados do usuário recuperados com sucesso:", userData);
      setUser(userData as User);
      return { error: null, user: userData };
    } catch (err) {
      console.error("Exceção durante o login:", err);
      return {
        error:
          err instanceof Error
            ? err
            : new Error("Erro desconhecido durante o login"),
        user: null,
      };
    }
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

      // Aguardar um pouco para dar tempo ao gatilho de inserir o usuário na tabela users
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Verificar se o usuário foi inserido na tabela users pelo gatilho
      let userData = null;
      let retries = 0;
      const maxRetries = 3;

      while (!userData && retries < maxRetries) {
        const { data: userCheckData, error: userCheckError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userCheckData) {
          userData = userCheckData;
          console.log(
            "Usuário encontrado na tabela users pelo gatilho:",
            userData
          );
          break;
        }

        console.log(
          `Tentativa ${
            retries + 1
          } de verificar usuário na tabela users. Aguardando...`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        retries++;
      }

      // Se o usuário não foi inserido pelo gatilho, tentar inserir manualmente
      if (!userData) {
        console.log(
          "Usuário não encontrado na tabela users após várias tentativas."
        );
        console.log("Tentando inserir manualmente na tabela users");

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
        const { error: dbError, data: insertData } = await supabase
          .from("users")
          .insert([
            {
              id: data.user.id,
              email,
              name,
              role,
            },
          ])
          .select();

        if (dbError) {
          console.error("Erro ao inserir na tabela users:", dbError);
          console.error(
            "Detalhes do erro:",
            dbError.message,
            dbError.details,
            dbError.hint
          );
          return { error: dbError };
        } else {
          console.log("Usuário inserido na tabela users com sucesso");
          userData = insertData?.[0];
        }
      }

      // Fazer logout para que o usuário faça login novamente na tela de login
      await supabase.auth.signOut();

      return { error: null, user: data.user };
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
