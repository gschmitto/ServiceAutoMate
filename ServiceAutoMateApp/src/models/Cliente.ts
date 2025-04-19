import { FretePorCidade } from "./FretePorCidade";

export interface Cliente {
  id: string;
  nomeEmpresa: string;
  endereco: string;
  cidade: string;
  valorMaximoNota: number;
  porcentagemCobranca: number;
  valorFretePorCidade?: FretePorCidade[] | null;
}
