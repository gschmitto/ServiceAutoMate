import React, { useState, useEffect, useCallback, Fragment } from "react";
import { AcaoAddContainer, Button, Container } from "../../shared/styled";
import { SolicitacaoServico, SolicitacoesServico } from "../../models/SolicitacaoServico";
import { SolicitacaoService } from "../../services/SolicitacaoService";
import Pagination from "../../components/Pagination";
import SolicitacaoTable from "./SolicitacaoTable";
import SolicitacaoFormPopup from "./SolicitacaoFormPopup";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

interface SolicitacoesProps {
  title: string;
}

const Solicitacoes: React.FC<SolicitacoesProps> = ({ title }) => {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacoesServico[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);

  const fetchSolicitacoes = useCallback(async () => {
    try {
      const data = await SolicitacaoService.getSolicitacoes(currentPage, 10);
      setSolicitacoes(data.items);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchSolicitacoes();
  }, [currentPage, fetchSolicitacoes]);

  const handleSave = async (form: SolicitacaoServico) => {
    try {
      const resultado = await SolicitacaoService.saveSolicitacao({
        ...form,
        valorFrete: Number(form.valorFrete) || 0,
        quantidadeVolumes: Number(form.quantidadeVolumes) || 0,
        notasFiscais: form.notasFiscais.map(nf => ({
          numeroNota: nf.numeroNota,
          valorNota: Number(nf.valorNota) || 0,
        }))
      });
      fetchSolicitacoes();
      toast.success("Solicitação de serviço adicionada com sucesso!");
      return resultado;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <AcaoAddContainer>
        <h2>{title}</h2>
        <Button onClick={() => setPopup(true)}>
          + Nova Solicitação
        </Button>
      </AcaoAddContainer>
      {loading ? <Loader /> : (
        <Fragment>
          <SolicitacaoTable solicitacoes={solicitacoes} fetchSolicitacoes={fetchSolicitacoes} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </Fragment>
      )}
      {popup && (
        <SolicitacaoFormPopup
          solicitacao={undefined}
          isOpen={popup}
          onClose={() => setPopup(false)}
          onSave={(solicitacao, _, callback) => handleSave(solicitacao).then(callback)}
        />
      )}
    </Container>
  );
};

export default Solicitacoes;
