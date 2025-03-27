import { DadosNotaFiscal } from "./DadosNotaFiscal";

export interface SolicitacaoServico {
  id: string;
  clienteId: string;
  destinatario: string;
  cidadeDestinatario: string;
  quantidadeVolumes: number;
  valorFrete: number;
  notasFiscais: DadosNotaFiscal[];
  dataCriacao: string;
}