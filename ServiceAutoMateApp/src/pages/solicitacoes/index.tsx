import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  AcaoAddContainer,
  Button,
  Container,
  FiltroContent,
  Input,
  Label,
} from "../../shared/styled";
import {
  SolicitacaoServico,
  SolicitacoesServico,
} from "../../models/SolicitacaoServico";
import { SolicitacaoService } from "../../services/SolicitacaoService";
import Pagination from "../../components/Pagination";
import SolicitacaoTable from "./SolicitacaoTable";
import SolicitacaoFormPopup from "./SolicitacaoFormPopup";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import AsyncSelect from "react-select/async";
import { ClienteService } from "../../services/ClienteService";
import { Cliente } from "../../models/Cliente";

interface SolicitacoesProps {
  title: string;
}

const Solicitacoes: React.FC<SolicitacoesProps> = ({ title }) => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacoesServico[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataInicial, setDataInicial] = useState<Date | null>(null);
  const [dataFinal, setDataFinal] = useState<Date | null>(null);

  const fetchSolicitacoes = useCallback(async () => {
    try {
      const data = await SolicitacaoService.getSolicitacoes(
        currentPage,
        10,
        selectedCliente ? selectedCliente.value : undefined,
        dataInicial,
        dataFinal
      );
      setSolicitacoes(data.items);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCliente, dataInicial, dataFinal]);

  useEffect(() => {
    fetchSolicitacoes();
  }, [currentPage, fetchSolicitacoes]);

  const handleSave = async (form: SolicitacaoServico) => {
    try {
      const resultado = await SolicitacaoService.saveSolicitacao({
        ...form,
        valorFrete: Number(form.valorFrete) || 0,
        quantidadeVolumes: Number(form.quantidadeVolumes) || 0,
        notasFiscais: form.notasFiscais.map((nf) => ({
          numeroNota: nf.numeroNota,
          valorNota: Number(nf.valorNota) || 0,
        })),
      });
      fetchSolicitacoes();
      toast.success("Solicitação de serviço adicionada com sucesso!");
      return resultado;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const loadOptions = async (inputValue: string) => {
    if (inputValue.length < 3) {
      return [];
    }

    try {
      const data = await ClienteService.getClientes(1, 10, inputValue);
      return data.items.map((cliente: Cliente) => ({
        value: cliente.id,
        label: cliente.nomeEmpresa,
      }));
    } catch (error: any) {
      toast.error(error.message);
      return [];
    }
  };

  const handleClienteInputChange = (inputValue: any) => {
    setSelectedCliente(inputValue);
  };

  return (
    <Container>
      <AcaoAddContainer>
        <h2>{title}</h2>
        <Button onClick={() => setPopup(true)}>+ Nova Solicitação</Button>
      </AcaoAddContainer>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <FiltroContent width={750}>
            <div style={{ width: "280px" }}>
              <Label>Cliente:</Label>
              <AsyncSelect
                isClearable
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                placeholder="Buscar Cliente..."
                value={selectedCliente}
                onChange={(selectedOption) => {
                  handleClienteInputChange(selectedOption);
                }}
                onInputChange={(inputValue) => {
                  setSearchTerm(inputValue);
                }}
                loadingMessage={() => "Carregando..."}
                noOptionsMessage={() =>
                  searchTerm.length < 3
                    ? "Digite pelo menos 3 letras..."
                    : "Nenhum cliente encontrado"
                }
                styles={{
                  container: (base) => ({
                    ...base,
                    width: "100%",
                  }),
                  control: (base) => ({
                    ...base,
                    marginBottom: 8,
                    marginTop: 4,
                    lineHeight: 1.75,
                    "&:focus": {
                      borderColor: "#4f85cb",
                      boxShadow: "0 0 5px rgba(0, 123, 255, 0.5)",
                      outline: "none",
                    },
                    "&:hover": {
                      borderColor: "#0056b3",
                    },
                  }),
                }}
              />
            </div>
            <div>
              <Label>Data Inicial:</Label>
              <Input
                type="date"
                placeholder=""
                value={
                  dataInicial ? dataInicial.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setDataInicial(e.target.valueAsDate)}
              />
            </div>
            <div>
              <Label>Data Final:</Label>
              <Input
                type="date"
                placeholder=""
                value={dataFinal ? dataFinal.toISOString().split("T")[0] : ""}
                onChange={(e) => setDataFinal(e.target.valueAsDate)}
              />
            </div>
          </FiltroContent>
          <SolicitacaoTable
            solicitacoes={solicitacoes}
            fetchSolicitacoes={fetchSolicitacoes}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Fragment>
      )}
      {popup && (
        <SolicitacaoFormPopup
          solicitacao={undefined}
          isOpen={popup}
          onClose={() => setPopup(false)}
          onSave={(solicitacao, _, callback) =>
            handleSave(solicitacao).then(callback)
          }
        />
      )}
    </Container>
  );
};

export default Solicitacoes;
