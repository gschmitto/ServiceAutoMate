import axios from "axios";
import { Cliente } from "../models/Cliente";

const API_URL = "/api/clientes";

interface PagedResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export const ClienteService = {
  getClientes: async (page = 1, pageSize = 10, nome?: string) => {
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
      if (nome) {
        params.set('nome', nome);
      }
      const url = `${API_URL}?${params.toString()}`;
      const response = await axios.get<PagedResult<Cliente>>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.detalhes || "Erro ao obter clientes.");
    }
  },

  saveCliente: async (cliente: Cliente) => {
    try {
      if (cliente.id && cliente.id !== "0") {
        await axios.put(`${API_URL}/${cliente.id}`, cliente);
      } else {
        await axios.post(API_URL, cliente);
      }
    } catch (error: any) {
      throw new Error(error.response.data.detalhes || "Erro ao salvar cliente.");
    }
  },

  deleteCliente: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error: any) {
      throw new Error(error.response.data.detalhes || "Erro ao excluir cliente.");
    }
  },
};
