import { createClient } from "@supabase/supabase-js";

// Essas variáveis de ambiente precisarão ser configuradas no arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Variáveis de ambiente do Supabase não estão configuradas corretamente.",
    { supabaseUrl, supabaseAnonKey }
  );
}

// Cria o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Tipos para as tabelas do banco de dados
export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "participant" | "judge";
  created_at: string;
};

export type Competition = {
  id: string;
  name: string;
  description: string;
  rules: string;
  submission_start_date: string;
  submission_end_date: string;
  judging_start_date: string;
  judging_end_date: string;
  status: "draft" | "active" | "judging" | "completed";
  created_at: string;
};

export type Category = {
  id: string;
  competition_id: string;
  name: string;
  description: string;
  allowed_file_types: string[];
  created_at: string;
};

export type Criteria = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  scale_min: number;
  scale_max: number;
  created_at: string;
};

export type Submission = {
  id: string;
  participant_id: string;
  category_id: string;
  title: string;
  description: string;
  file_url: string;
  submission_date: string;
  created_at: string;
};

export type Evaluation = {
  id: string;
  judge_id: string;
  submission_id: string;
  criteria_id: string;
  score: number;
  comments: string;
  created_at: string;
};

export type JudgeAssignment = {
  id: string;
  judge_id: string;
  category_id: string;
  created_at: string;
};
