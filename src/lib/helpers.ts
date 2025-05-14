// Função para formatar datas
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Função para validar tipos de arquivo por categoria
export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  const fileType = file.type.split('/')[1];
  return allowedTypes.includes(fileType);
};

// Função para calcular a média das avaliações
export const calculateAverageScore = (
  scores: number[]
): number => {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
};

// Função para gerar um ID único
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Função para verificar se o usuário tem permissão para acessar uma rota
export const hasPermission = (
  userRole: string,
  requiredRoles: string[]
): boolean => {
  return requiredRoles.includes(userRole);
};

// Função para truncar texto
export const truncateText = (
  text: string,
  maxLength: number
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
