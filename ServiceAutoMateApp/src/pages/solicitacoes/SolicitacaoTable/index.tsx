import React, { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Button, DeleteButton, Popup, PopupContent, AcaoConteiner, Table, Th, Td } from "../../../shared/styled";
import { SolicitacaoServico } from "../../../models/SolicitacaoServico";
import { SolicitacaoService } from "../../../services/SolicitacaoService";
import SolicitacaoFormPopup from "../SolicitacaoFormPopup";
import { toast } from "react-toastify";

interface SolicitacaoTableProps {
  solicitacoes: SolicitacaoServico[];
  fetchSolicitacoes: () => void;
}

const SolicitacaoTable: React.FC<SolicitacaoTableProps> = ({ solicitacoes, fetchSolicitacoes }) => {
  const [popup, setPopup] = useState(false);
  const [popupExcluir, setPopupExcluir] = useState<string | null>(null);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoServico | undefined>(undefined);

  const handleEdit = (id: string) => {
    const solicitacaoSelecionada = solicitacoes.find((solicitacao) => solicitacao.id === id);
    if (solicitacaoSelecionada) {
      setSolicitacaoSelecionada(solicitacaoSelecionada);
      setPopup(true);
    }
  };

  const handleSave = async (form: SolicitacaoServico) => {
    try {
      await SolicitacaoService.saveSolicitacao({
        ...form,
        notasFiscais: form.notasFiscais.map((nota) => ({
          numeroNota: nota.numeroNota,
          valorNota: Number(nota.valorNota) || 0,
        })),
      });
      fetchSolicitacoes();
      setPopup(false);
      toast.success('Solicitação de serviço atualizada com sucesso!');
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
        await SolicitacaoService.deleteSolicitacao(popupExcluir);
        fetchSolicitacoes();
        setPopupExcluir(null);
        toast.success('Solicitação de serviço excluída com sucesso!');
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
            <Th>Destinatário</Th>
            <Th>Cidade Destinatário</Th>
            <Th>Quantidade de Volumes</Th>
            <Th>Valor do Frete</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((solicitacao) => (
            <tr key={solicitacao.id}>
              <Td>{solicitacao.destinatario}</Td>
              <Td>{solicitacao.cidadeDestinatario}</Td>
              <Td>{solicitacao.quantidadeVolumes}</Td>
              <Td>R$ {solicitacao.valorFrete}</Td>
              <Td>
                <AcaoConteiner>
                  <Button onClick={() => handleEdit(solicitacao.id)}>
                    <FiEdit size={20} />
                  </Button>
                  <DeleteButton onClick={() => handleDeleteClick(solicitacao.id)}>
                    <FiTrash size={20} />
                  </DeleteButton>
                </AcaoConteiner>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {popup && (
        <SolicitacaoFormPopup
          solicitacao={solicitacaoSelecionada}
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

export default SolicitacaoTable;
