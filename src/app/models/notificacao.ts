export interface Notificacao {
  id: number;
  mensagem: string;
  data: Date;
  lida: boolean;
  destinatarioId: number;
  link?: string;
}
