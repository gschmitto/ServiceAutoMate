import React, { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { Button, DeleteButton, Popup, PopupContent, AcaoConteiner, Table, Th, Td } from "../../../shared/styled";
import { SolicitacaoServico, SolicitacoesServico } from "../../../models/SolicitacaoServico";
import { SolicitacaoService } from "../../../services/SolicitacaoService";
import SolicitacaoFormPopup from "../SolicitacaoFormPopup";
import { toast } from "react-toastify";

interface SolicitacaoTableProps {
  solicitacoes: SolicitacoesServico[];
  fetchSolicitacoes: () => void;
}

const SolicitacaoTable: React.FC<SolicitacaoTableProps> = ({ solicitacoes, fetchSolicitacoes }) => {
  const [popup, setPopup] = useState(false);
  const [popupExcluir, setPopupExcluir] = useState<string | null>(null);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<SolicitacaoServico | undefined>(undefined);

  const handleEdit = (id: string) => {
    const solicitacaoSelecionada = solicitacoes.find((s) => s.solicitacaoServico.id === id);
    if (solicitacaoSelecionada) {
      setSolicitacaoSelecionada(solicitacaoSelecionada.solicitacaoServico);
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
            <Th>Cliente</Th>
            <Th>Destinatário</Th>
            <Th>Cidade Destinatário</Th>
            <Th>Quant. de Volumes</Th>
            <Th>Total das Notas</Th>
            <Th>Valor do Frete</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map((s) => (
            <tr key={s.solicitacaoServico.id}>
              <Td>{s.nomeCliente}</Td>
              <Td>{s.solicitacaoServico.destinatario}</Td>
              <Td>{s.solicitacaoServico.cidadeDestinatario}</Td>
              <Td>{s.solicitacaoServico.quantidadeVolumes}</Td>
              <Td>R$ {s.totalNotas}</Td>
              <Td>R$ {s.solicitacaoServico.valorFrete}</Td>
              <Td>
                <AcaoConteiner>
                  <Button onClick={() => handleEdit(s.solicitacaoServico.id)}>
                    <FiEdit size={20} />
                  </Button>
                  <DeleteButton onClick={() => handleDeleteClick(s.solicitacaoServico.id)}>
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
          onSave={(solicitacao, _, callback) => handleSave(solicitacao).then(callback)}
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
