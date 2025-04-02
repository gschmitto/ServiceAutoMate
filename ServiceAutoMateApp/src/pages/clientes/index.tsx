import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  AcaoAddContainer,
  Button,
  Container,
  FiltroBtn,
  FiltroContent,
  Input,
} from "../../shared/styled";
import { Cliente } from "../../models/Cliente";
import { ClienteService } from "../../services/ClienteService";
import Pagination from "../../components/Pagination";
import ClienteTable from "./ClienteTable";
import ClienteFormPopup from "./ClienteFormPopup";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

interface ClientesProps {
  title: string;
}

const Clientes: React.FC<ClientesProps> = ({ title }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [nomePesquisa, setNomePesquisa] = useState("");

  const fetchClientes = useCallback(async () => {
    try {
      const data = await ClienteService.getClientes(
        currentPage,
        10,
        nomePesquisa
      );
      setClientes(data.items);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.mensagem);
    } finally {
      setLoading(false);
    }
  }, [currentPage, nomePesquisa]);

  useEffect(() => {
    fetchClientes();
  }, [currentPage, fetchClientes, nomePesquisa]);

  const handleSave = async (form: Cliente) => {
    try {
      await ClienteService.saveCliente({
        ...form,
        valorMaximoNota: Number(form.valorMaximoNota) || 0,
        porcentagemCobranca: Number(form.porcentagemCobranca) || 0,
        valorFretePorCidade: form.valorFretePorCidade?.map((frete) => ({
          cidade: frete.cidade,
          valor: Number(frete.valor) || 0,
        })),
      });
      fetchClientes();
      setPopup(false);
      toast.success("Cliente adicionado com sucesso!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <AcaoAddContainer>
        <h2>{title}</h2>
        <Button onClick={() => setPopup(true)}>+ Novo Cliente</Button>
      </AcaoAddContainer>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <FiltroContent>
            <Input
              type="text"
              value={nomePesquisa}
              onChange={(e) => setNomePesquisa(e.target.value)}
              placeholder="Pesquisar pelo nome do cliente..."
            />
            {nomePesquisa && (
              <FiltroBtn onClick={() => setNomePesquisa("")}>
                <FaTimes />
              </FiltroBtn>
            )}
          </FiltroContent>
          <ClienteTable clientes={clientes} fetchClientes={fetchClientes} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Fragment>
      )}
      {popup && (
        <ClienteFormPopup
          cliente={undefined}
          isOpen={popup}
          onClose={() => setPopup(false)}
          onSave={handleSave}
        />
      )}
    </Container>
  );
};

export default Clientes;
