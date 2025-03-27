import React, { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Button, DeleteButton, Popup, PopupContent, AcaoConteiner, Table, Th, Td } from "../../../shared/styled";
import { Cliente } from "../../../models/Cliente";
import { ClienteService } from "../../../services/ClienteService";
import ClienteFormPopup from "../ClienteFormPopup";
import { toast } from "react-toastify";

interface ClienteTableProps {
  clientes: Cliente[];
  fetchClientes: () => void;
}

const ClienteTable: React.FC<ClienteTableProps> = ({ clientes, fetchClientes }) => {
  const [popup, setPopup] = useState(false);
  const [popupExcluir, setPopupExcluir] = useState<string | null>(null);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | undefined>(undefined);

  const handleEdit = (id: string) => {
    const clienteSelecionado = clientes.find((cliente) => cliente.id === id);
    if (clienteSelecionado) {
      setClienteSelecionado(clienteSelecionado);
      setPopup(true);
    }
  };

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
      toast.success('Cliente atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (id: string) => {
    setPopupExcluir(id);
  };

  const handleDelete = async () => {
    try {
      if (popupExcluir !== null) {
        await ClienteService.deleteCliente(popupExcluir);
        fetchClientes();
        setPopupExcluir(null);
        toast.success('Cliente excluído com sucesso!');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Endereço</Th>
            <Th>Cidade</Th>
            <Th>Valor Máx.</Th>
            <Th>% Cobrança</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <Td>{cliente.nomeEmpresa}</Td>
              <Td>{cliente.endereco}</Td>
              <Td>{cliente.cidade}</Td>
              <Td>R$ {cliente.valorMaximoNota}</Td>
              <Td>{cliente.porcentagemCobranca}%</Td>
              <Td>
                <AcaoConteiner>
                  <Button onClick={() => handleEdit(cliente.id)}>
                    <FiEdit size={20} />
                  </Button>
                  <DeleteButton onClick={() => handleDeleteClick(cliente.id)}>
                    <FiTrash size={20} />
                  </DeleteButton>
                </AcaoConteiner>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {popup && (
        <ClienteFormPopup
          cliente={clienteSelecionado}
          isOpen={popup}
          onClose={() => setPopup(false)}
          onSave={handleSave}
        />
      )}

      {popupExcluir && (
        <Popup>
          <PopupContent>
            <h3>Tem certeza que deseja excluir?</h3>
            <AcaoConteiner>
              <Button onClick={handleDelete}>Sim</Button>
              <Button onClick={() => setPopupExcluir(null)}>Não</Button>
            </AcaoConteiner>
          </PopupContent>
        </Popup>
      )}
    </>
  );
};

export default ClienteTable;