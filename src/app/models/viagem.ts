import { Veiculo } from "./veiculo";

export interface Viagem {
  id?: number;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  origem: string;
  destino: string;
  situacao: string;
  motoristaId: number;
  motoristaNome?: string;
  mediaMotorista?: number;

  placa?: Veiculo;
  modelo?: Veiculo;
}
