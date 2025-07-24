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
  veiculoId?: number;

  veiculoModelo?: string;
  veiculoPlaca?: string;
  veiculoCor?: string;
}
