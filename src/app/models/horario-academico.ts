export interface HorarioAcademico {
  id?: number;
  descricao: string;
  dia: 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO';
  horario: string; 
  situacao: string;
  idAluno: number;
}
