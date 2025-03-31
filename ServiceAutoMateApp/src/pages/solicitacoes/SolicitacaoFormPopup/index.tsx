import React, { useState, useEffect } from "react";
import { Popup, PopupContent, Button, Input, AcaoConteiner, DeleteButton, InputContainer, Label, FlexWrapper, FlexContainer, PrefixSymbol, SaveButton } from "../../../shared/styled";
import { DadosNotaFiscal } from "../../../models/DadosNotaFiscal";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ContainerNotasAdd, NotasContainer, NotasListContainer } from "./styled";
import { SolicitacaoServico } from "../../../models/SolicitacaoServico";
import { Cliente } from "../../../models/Cliente";
import { ClienteService } from "../../../services/ClienteService";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import AsyncSelect from "react-select/async";

interface SolicitacaoFormPopupProps {
  solicitacao?: SolicitacaoServico;
  isOpen: boolean;
  onClose: () => void;
  onSave: (solicitacao: SolicitacaoServico, form: FormState, callback: (resultado: any) => void) => void;
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

  const [selectedCliente, setSelectedCliente] = useState<{ value: string; label: string; } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFreteCalculado, setIsFreteCalculado] = useState(false);

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

  const handleSave = () => {
    const clienteId = selectedCliente?.value ?? '';
    onSave({
      ...form,
      notasFiscais: form.notasFiscais ?? [],
      quantidadeVolumes: Number(form.quantidadeVolumes) || 0,
      valorFrete: Number(form.valorFrete) || 0,
      clienteId,
    }, form, (resultado) => {
      setForm((prevForm) => ({
        ...prevForm,
        valorFrete: resultado.valorFrete,
      }));
    });
    setIsFreteCalculado(true);
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <FiX size={24} onClick={onClose} style={{ cursor: "pointer" }} />
        </div>
        <h3>{form.id ? "Editar Solicitação" : "Nova Solicitação"}</h3>
        <Label htmlFor="idCliente">Cliente: <span style={{ color: "red" }}>*</span></Label>
        <AsyncSelect
          isClearable
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          placeholder="Buscar Cliente..."
          value={selectedCliente}
          onChange={(selectedOption) => {
            setSelectedCliente(selectedOption);
          }}
          onInputChange={(inputValue) => {
            setSearchTerm(inputValue);
          }}
          loadingMessage={() => 'Carregando...'}
          noOptionsMessage={() => searchTerm.length < 3 ? "Digite pelo menos 3 letras..." : "Nenhum cliente encontrado"}
          styles={{
            control: (base) => ({
              ...base,
              marginBottom: 8,
              marginTop: 4,
              lineHeight: 1.75,
              '&:focus': {
                borderColor: '#4f85cb',
                boxShadow: '0 0 5px rgba(0, 123, 255, 0.5)',
                outline: 'none',
              },
              '&:hover': {
                borderColor: '#0056b3',
              },
            }),
          }}
        />
        <InputContainer>
          <Label htmlFor="destinatario">Nome destinatário: <span style={{ color: "red" }}>*</span></Label>
          <Input
            type="text"
            placeholder="Destinatário"
            value={form.destinatario}
            onChange={(e) => setForm({ ...form, destinatario: e.target.value })}
          />
        </InputContainer>
        <InputContainer>
          <Label htmlFor="cidadeDestinatario">Cidade destinatário: <span style={{ color: "red" }}>*</span></Label>
          <Input
            type="text"
            placeholder="Cidade Destinatário"
            value={form.cidadeDestinatario}
            onChange={(e) => setForm({ ...form, cidadeDestinatario: e.target.value })}
          />
        </InputContainer>
        <ContainerNotasAdd>
          <h4>Notas Fiscais</h4>
          {!isFreteCalculado && <Button onClick={handleAddNotaFiscal}>
            <FaPlus />
          </Button>}
        </ContainerNotasAdd>

        {(form.notasFiscais && form.notasFiscais.length > 0) && (
          <NotasListContainer>
            {form.notasFiscais.map((nota, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <NotasContainer key={index}>
                <FlexContainer display="flex" column>
                  <Label htmlFor="numeroNota">Número da nota: <span style={{ color: "red" }}>*</span></Label>
                  <Input
                    type="text"
                    placeholder="12345678"
                    value={nota.numeroNota}
                    onChange={(e) => handleNotaFiscalChange(index, "numeroNota", e.target.value)}
                  />
                </FlexContainer>
                <FlexContainer display="flex" column>
                  <Label htmlFor="valorNota">Valor da nota: <span style={{ color: "red" }}>*</span></Label>
                  <FlexContainer>
                    <PrefixSymbol>R$</PrefixSymbol>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="1000,00"
                      value={nota.valorNota}
                      onChange={(e) => handleNotaFiscalChange(index, "valorNota", e.target.value)}
                    />
                  </FlexContainer>
                </FlexContainer>
                {!isFreteCalculado && (
                  <DeleteButton
                    onClick={() => handleRemoveNotaFiscal(index)}
                    style={{width: 32, height: 32, alignSelf: "center", padding: 8, marginTop: 9}}
                  >
                    <FaTrash />
                  </DeleteButton>
                )}
              </NotasContainer>
            ))}
          </NotasListContainer>
        )}
        <FlexWrapper>
          <FlexContainer marginRight={16} display="flex" column>
            <Label htmlFor="quantidadeVolumes">Quantidade de volumes: <span style={{ color: "red" }}>*</span></Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="1"
              value={form.quantidadeVolumes}
              onChange={(e) => setForm({ ...form, quantidadeVolumes: e.target.value })}
            />
          </FlexContainer>
          {isFreteCalculado && (
            <FlexContainer display="flex" column>
              <Label htmlFor="valorFrete">Valor frete:</Label>
              <FlexContainer>
                <PrefixSymbol>R$</PrefixSymbol>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Clique p/ calcular"
                  value={form.valorFrete}
                  disabled
                />
              </FlexContainer>
            </FlexContainer>
          )}
        </FlexWrapper>

        <AcaoConteiner>
          {isFreteCalculado ? (
            <SaveButton onClick={onClose}>Concluir</SaveButton>
          ): (
            <>
              <SaveButton onClick={handleSave}>Calcular frete</SaveButton>
              <DeleteButton onClick={onClose}>Cancelar</DeleteButton>
            </>
          )}
        </AcaoConteiner>
      </PopupContent>
    </Popup>
  );
};

export default SolicitacaoFormPopup;
