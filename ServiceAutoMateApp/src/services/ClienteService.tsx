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
  getClientes: async (page = 1, pageSize = 10) => {
    try {
      const response = await axios.get<PagedResult<Cliente>>(`${API_URL}?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.detalhes);
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
      throw new Error(error.response.data.detalhes);
    }
  },

  deleteCliente: async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error: any) {
      throw new Error(error.response.data.detalhes);
    }
  },
};
