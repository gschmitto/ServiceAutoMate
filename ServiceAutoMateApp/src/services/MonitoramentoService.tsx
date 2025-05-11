import axios from "axios";

interface Monitoramento {
  id: string;
  data: Date;
  valor: number;
}

const API_URL = "/api/Monitoramento";

export const MonitoramentoService = {
  getMonitoramento: async () => {
    try {
      const response = await axios.get<Monitoramento>(`${API_URL}/previsao`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response.data.detalhes ?? "Erro ao obter monitoramento."
      );
    }
  },
};