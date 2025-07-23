export interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  mediaMotorista?: number;
  mediaCaronista?: number;
  login: string;

  fotoUrl?: string;
}
