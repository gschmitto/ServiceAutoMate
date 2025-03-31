import axios from "axios";
import { SolicitacaoServico, SolicitacoesServico } from "../models/SolicitacaoServico";

const API_URL = "/api/solicitacaoServico";

interface PagedResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export const SolicitacaoService = {
  getSolicitacoes: async (page = 1, pageSize = 10, clienteId?: string, dataInicial?: Date, dataFinal?: Date) => {
    try {
      const response = await axios.get<PagedResult<SolicitacoesServico>>(`${API_URL}`, {
        params: { page, pageSize, clienteId, dataInicial, dataFinal }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.detalhes || "Erro ao obter solicitações de serviço.");
    }
  },

  saveSolicitacao: async (solicitacao: SolicitacaoServico) => {
    try {
      if (solicitacao.id && solicitacao.id !== "0") {
        await axios.put(`${API_URL}/${solicitacao.id}`, solicitacao);
      } else {
        const response = await axios.post(API_URL, solicitacao);
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.response.data.detalhes || "Erro ao salvar solicitação de serviço.");
    }
  },

  deleteSolicitacao: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error: any) {
      throw new Error(error.response.data.detalhes || "Erro ao excluir solicitação de serviço.");
    }
  },
};
