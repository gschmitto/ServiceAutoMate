import { DadosNotaFiscal } from "./DadosNotaFiscal";

export interface SolicitacoesServico {
  solicitacaoServico: SolicitacaoServico;
  totalNotas: number;
  nomeCliente: string;
}

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