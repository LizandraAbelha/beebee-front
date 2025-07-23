export interface Avaliacao {
  id?: number;
  comentarioMotorista?: string;
  notaMotorista?: number;
  comentarioCaronista?: string;
  notaCaronista?: number;
  viagemAlunoId: number;
}
