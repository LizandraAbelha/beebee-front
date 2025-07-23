import { Viagem } from "./viagem";
import { Avaliacao } from "./avaliacao";

export interface ViagemAluno {
  id?: number;
  dataSolicitacao: string;
  dataConfirmacao?: string;
  observacao?: string;
  situacao: 'SOLICITADA' | 'PENDENTE' | 'CONFIRMADA' | 'CANCELADA' | 'FINALIZADA' | 'RECUSADA';
  alunoId: number;
  alunoNome?: string;
  viagem: Viagem;
  avaliacao?: Avaliacao;
  mediaCaronista?: number;
}
