import React, { useState, useEffect } from "react";
import { Popup, PopupContent, Button, Input, AcaoConteiner, DeleteButton } from "../../../shared/styled";
import { DadosNotaFiscal } from "../../../models/DadosNotaFiscal";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ContainerNotasAdd, NotasContainer, NotasListContainer } from "./styled";
import { SolicitacaoServico } from "../../../models/SolicitacaoServico";
import { Cliente } from "../../../models/Cliente";
import { ClienteService } from "../../../services/ClienteService";
import Select from "react-select/base";
import { toast } from "react-toastify";

interface SolicitacaoFormPopupProps {
  solicitacao?: SolicitacaoServico;
  isOpen: boolean;
  onClose: () => void;
  onSave: (solicitacao: SolicitacaoServico, form: FormState) => void;
}

type FormState = {
  id: string;
  clienteId: string | null;
  destinatario: string;
  cidadeDestinatario: string;
  quantidadeVolumes: string | number;
  valorFrete: string | number;
  notasFiscais: DadosNotaFiscal[] | null;
  dataCriacao: string;
};

const SolicitacaoFormPopup: React.FC<SolicitacaoFormPopupProps> = ({ solicitacao, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<FormState>({
    id: "",
    clienteId: "",
    destinatario: "",
    cidadeDestinatario: "",
    quantidadeVolumes: "",
    valorFrete: "",
    notasFiscais: null,
    dataCriacao: "",
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (solicitacao) {
      setForm({
        ...solicitacao,
        quantidadeVolumes: solicitacao.quantidadeVolumes.toString(),
        valorFrete: solicitacao.valorFrete.toString(),
        notasFiscais: solicitacao.notasFiscais ?? null,
      });
    } else {
      setForm({
        id: "",
        clienteId: "",
        destinatario: "",
        cidadeDestinatario: "",
        quantidadeVolumes: "",
        valorFrete: "",
        notasFiscais: null,
        dataCriacao: "",
      });
    }
  }, [solicitacao]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length >= 3) {
        setIsLoading(true);
        try {
          const data = await ClienteService.getClientes(1, 10, searchTerm);
          setClientes(data.items || []);
        } catch (error: any) {
          toast.error(error.message);
        }
        setIsLoading(false);
      } else {
        setClientes([]);
      }
    }, 500); // 500ms de debounce
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSave = () => {
    const clienteId = form.clienteId ?? '';
    onSave({
      ...form,
      notasFiscais: form.notasFiscais ?? [],
      quantidadeVolumes: Number(form.quantidadeVolumes) || 0,
      valorFrete: Number(form.valorFrete) || 0,
      clienteId,
    }, form);
  };

  const handleAddNotaFiscal = () => {
    setForm((prev) => ({
      ...prev,
      notasFiscais: [...(prev.notasFiscais ?? [])].concat({ numeroNota: "", valorNota: "" }),
    }));
  };

  const handleRemoveNotaFiscal = (index: number) => {
    setForm((prev) => ({
      ...prev,
      notasFiscais: (prev.notasFiscais ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleNotaFiscalChange = (index: number, key: string, value: string) => {
    setForm((prev) => {
      const updatedNotasFiscais = (prev.notasFiscais ?? []).map((nota, i) =>
        i === index ? { ...nota, [key]: value } : nota
      );
      return { ...prev, notasFiscais: updatedNotasFiscais };
    });
  };

  if (!isOpen) return null;

  return (
    <Popup>
      <PopupContent>
        <h3>{form.id ? "Editar Solicitação" : "Nova Solicitação"}</h3>
        <Select
          inputValue={clientes.find((c) => c.id === form.clienteId)?.nomeEmpresa ?? ''}
          menuIsOpen={menuOpen}
          onMenuOpen={() => setMenuOpen(true)}
          onMenuClose={() => setMenuOpen(false)}
          placeholder="Buscar Cliente..."
          isLoading={isLoading}
          onInputChange={(value, { action }) => {
            if (action === "input-change") {
              setSearchTerm(value);
            }
          }}        
          options={clientes.map((cliente) => ({
            value: cliente.id,
            label: cliente.nomeEmpresa,
          }))}
          onChange={(selectedOption) => {
            if (selectedOption) {
              setForm((prevForm) => ({
                ...prevForm,
                clienteId: selectedOption.value,
              }));
            } else {
              setForm((prevForm) => ({
                ...prevForm,
                clienteId: null,
              }));
            }
          }}
          value={clientes.find((c) => c.id === form.clienteId) ? { 
            value: form.clienteId, 
            label: clientes.find((c) => c.id === form.clienteId)?.nomeEmpresa ?? '' 
          } : null}
          noOptionsMessage={() => searchTerm.length < 3 ? "Digite pelo menos 3 letras..." : "Nenhum cliente encontrado"}
          isClearable
        />
        <Input
          type="text"
          placeholder="Destinatário"
          value={form.destinatario}
          onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
        />
        <br />
        <Input
          type="text"
          placeholder="Cidade Destinatário"
          value={form.cidadeDestinatario}
          onChange={(e) => setForm({ ...form, cidadeDestinatario: e.target.value })}
        />
        <br />
        <Input
          type="number"
          placeholder="Quantidade de Volumes"
          value={form.quantidadeVolumes}
          onChange={(e) => setForm({ ...form, quantidadeVolumes: e.target.value })}
        />
        <br />
        <Input
          type="number"
          placeholder="Valor Frete"
          value={form.valorFrete}
          onChange={(e) => setForm({ ...form, valorFrete: e.target.value })}
        />
        <br />
        <ContainerNotasAdd>
          <h4>Notas Fiscais</h4>
          <Button onClick={handleAddNotaFiscal}>
            <FaPlus />
          </Button>
        </ContainerNotasAdd>

        {(form.notasFiscais && form.notasFiscais.length > 0) && (
          <NotasListContainer>
            {form.notasFiscais.map((nota, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <NotasContainer key={index}>
                <Input
                  type="text"
                  placeholder="Número da Nota"
                  value={nota.numeroNota}
                  onChange={(e) => handleNotaFiscalChange(index, "numeroNota", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Valor da Nota"
                  value={nota.valorNota}
                  onChange={(e) => handleNotaFiscalChange(index, "valorNota", e.target.value)}
                />
                <DeleteButton onClick={() => handleRemoveNotaFiscal(index)} style={{ margin: 8, marginInline: 0 }}>
                  <FaTrash />
                </DeleteButton>
              </NotasContainer>
            ))}
          </NotasListContainer>
        )}

        <AcaoConteiner>
          <Button onClick={handleSave}>Salvar</Button>
          <Button onClick={onClose}>Cancelar</Button>
        </AcaoConteiner>
      </PopupContent>
    </Popup>
  );
};

export default SolicitacaoFormPopup;
