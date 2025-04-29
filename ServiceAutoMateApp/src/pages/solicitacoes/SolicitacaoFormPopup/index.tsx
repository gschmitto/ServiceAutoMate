import React, { useState, useEffect } from "react";
import {
  Popup,
  PopupContent,
  Button,
  Input,
  AcaoConteiner,
  DeleteButton,
  InputContainer,
  Label,
  FlexWrapper,
  FlexContainer,
  PrefixSymbol,
  SaveButton,
  ErrorMessage,
} from "../../../shared/styled";
import { DadosNotaFiscal } from "../../../models/DadosNotaFiscal";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  ContainerNotasAdd,
  NotasContainer,
  NotasListContainer,
} from "./styled";
import {
  SolicitacaoServico,
  SolicitacoesServico,
} from "../../../models/SolicitacaoServico";
import { Cliente } from "../../../models/Cliente";
import { ClienteService } from "../../../services/ClienteService";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import AsyncSelect from "react-select/async";
import { stringToFloat } from "../../../utils";

interface SolicitacaoFormPopupProps {
  solicitacao?: SolicitacoesServico;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    solicitacao: SolicitacaoServico,
    form: FormState,
    callback: (resultado: any) => void
  ) => void;
}

type FormState = {
  id: string;
  nomeCliente: string;
  clienteId: string | null;
  destinatario: string;
  cidadeDestinatario: string;
  quantidadeVolumes: string | number;
  valorFrete: string | number;
  notasFiscais: DadosNotaFiscal[] | null;
  dataCriacao: string;
  dataEdicao: string;
};

export interface FormErrors {
  [key: string]: string;
}

const SolicitacaoFormPopup: React.FC<SolicitacaoFormPopupProps> = ({
  solicitacao,
  isOpen,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<FormState>({
    id: "",
    clienteId: "",
    nomeCliente: "",
    destinatario: "",
    cidadeDestinatario: "",
    quantidadeVolumes: "",
    valorFrete: "",
    notasFiscais: null,
    dataCriacao: "",
    dataEdicao: "",
  });

  const [selectedCliente, setSelectedCliente] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFreteCalculado, setIsFreteCalculado] = useState(false);
  const [isEditado, setIsEditado] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (solicitacao) {
      setForm({
        ...solicitacao.solicitacaoServico,
        nomeCliente: solicitacao.nomeCliente ?? "",
        quantidadeVolumes:
          solicitacao.solicitacaoServico.quantidadeVolumes.toString(),
        valorFrete: solicitacao.solicitacaoServico.valorFrete.toFixed(2),
        notasFiscais: solicitacao.solicitacaoServico.notasFiscais ?? null,
      });
      setSelectedCliente({
        value: solicitacao.solicitacaoServico.clienteId,
        label: solicitacao.nomeCliente,
      });
    } else {
      setForm({
        id: "",
        clienteId: "",
        nomeCliente: "",
        destinatario: "",
        cidadeDestinatario: "",
        quantidadeVolumes: "",
        valorFrete: "",
        notasFiscais: null,
        dataCriacao: "",
        dataEdicao: "",
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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (selectedCliente === null) {
      newErrors.clienteId = "Cliente é obrigatório.";
    }

    if (!form.destinatario) {
      newErrors.destinatario = "Nome do destinatário é obrigatório.";
    } else if (form.destinatario.length < 3) {
      newErrors.destinatario =
        "Nome do destinatário deve ter pelo menos 3 caracteres.";
    }

    if (!form.cidadeDestinatario) {
      newErrors.cidadeDestinatario = "Cidade do destinatário é obrigatória.";
    } else if (form.cidadeDestinatario.length < 3) {
      newErrors.cidadeDestinatario =
        "Cidade do destinatário deve ter pelo menos 3 caracteres.";
    }

    if (form.notasFiscais && form.notasFiscais.length > 0) {
      form.notasFiscais.forEach((nota, index) => {
        if (!nota.numeroNota) {
          newErrors[`numeroNota_${index}`] = "Número da nota é obrigatório.";
        } else if (nota.numeroNota.length < 3) {
          newErrors[`numeroNota_${index}`] =
            "Número da nota deve ter pelo menos 3 caracteres.";
        }

        if (!nota.valorNota) {
          newErrors[`valorNota_${index}`] = "Valor da nota é obrigatório.";
        } else if (stringToFloat(nota.valorNota.toString()) <= 0) {
          newErrors[`valorNota_${index}`] =
            "Valor da nota deve ser maior que zero.";
        }
      });
    }

    if (!form.quantidadeVolumes) {
      newErrors.quantidadeVolumes = "Quantidade de volumes é obrigatória.";
    } else if (Number(form.quantidadeVolumes) <= 0) {
      newErrors.quantidadeVolumes =
        "Quantidade de volumes deve ser maior que zero.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length <= 0) {
      const clienteId = selectedCliente?.value ?? "";
      onSave(
        {
          ...form,
          notasFiscais: form.notasFiscais ?? [],
          quantidadeVolumes: Number(form.quantidadeVolumes) || 0,
          valorFrete: Number(form.valorFrete) || 0,
          clienteId,
        },
        form,
        (resultado) => {
          setForm((prevForm) => ({
            ...prevForm,
            valorFrete: resultado.valorFrete.toFixed(2),
          }));
        }
      );
      setIsEditado(false);
      setIsFreteCalculado(true);
      onClose();
    }
  };

  const handleClienteInputChange = (inputValue: any) => {
    setSelectedCliente(inputValue);
    if (inputValue !== "") {
      setErrors((prevErrors: any) => ({ ...prevErrors, clienteId: null }));
    }
  };

  const handleAddNotaFiscal = () => {
    setForm((prev) => ({
      ...prev,
      notasFiscais: [...(prev.notasFiscais ?? [])].concat({
        id: crypto.randomUUID(),
        numeroNota: "",
        valorNota: "",
      }),
    }));
    setIsFreteCalculado(false);
    setIsEditado(true);
  };

  const handleRemoveNotaFiscal = (index: number) => {
    setForm((prev) => ({
      ...prev,
      notasFiscais: (prev.notasFiscais ?? []).filter((_, i) => i !== index),
    }));
    setIsFreteCalculado(false);
    setIsEditado(true);
  };

  const handleNotaFiscalChange = (
    index: number,
    key: string,
    value: string
  ) => {
    setForm((prev) => {
      const updatedNotasFiscais = (prev.notasFiscais ?? []).map((nota, i) =>
        i === index ? { ...nota, [key]: value } : nota
      );
      return { ...prev, notasFiscais: updatedNotasFiscais };
    });
  };

  const handleNotaFiscalInputChange =
    (index: number, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleNotaFiscalChange(index, field, e.target.value);
      if (e.target.value !== "") {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [`${field}_${index}`]: null,
        }));
      }
      setIsEditado(true);
    };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
      if (e.target.value !== "") {
        setErrors((prevErrors: any) => ({ ...prevErrors, [field]: null }));
      }
      setIsEditado(true);
    };

  if (!isOpen) return null;

  return (
    <Popup>
      <PopupContent>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <FiX size={24} onClick={onClose} style={{ cursor: "pointer" }} />
        </div>
        <h3>{form.id ? "Editar Solicitação" : "Nova Solicitação"}</h3>
        <Label htmlFor="idCliente">
          Cliente: <span style={{ color: "red" }}>*</span>
        </Label>
        <AsyncSelect
          isClearable
          cacheOptions
          isDisabled={!!form.id}
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
        {errors.clienteId && <ErrorMessage>{errors.clienteId}</ErrorMessage>}
        <InputContainer>
          <Label htmlFor="destinatario">
            Nome destinatário: <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="text"
            placeholder="Destinatário"
            value={form.destinatario}
            onChange={handleInputChange("destinatario")}
          />
        </InputContainer>
        {errors.destinatario && (
          <ErrorMessage>{errors.destinatario}</ErrorMessage>
        )}
        <InputContainer>
          <Label htmlFor="cidadeDestinatario">
            Cidade destinatário: <span style={{ color: "red" }}>*</span>
          </Label>
          <Input
            type="text"
            placeholder="Cidade Destinatário"
            value={form.cidadeDestinatario}
            onChange={handleInputChange("cidadeDestinatario")}
          />
        </InputContainer>
        {errors.cidadeDestinatario && (
          <ErrorMessage>{errors.cidadeDestinatario}</ErrorMessage>
        )}
        <ContainerNotasAdd>
          <h4>Notas Fiscais</h4>
          {(!isFreteCalculado || !!form.id) && (
            <Button onClick={handleAddNotaFiscal}>
              <FaPlus />
            </Button>
          )}
        </ContainerNotasAdd>

        {form.notasFiscais && form.notasFiscais.length > 0 && (
          <NotasListContainer>
            {form.notasFiscais.map((nota, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <NotasContainer key={index}>
                <FlexContainer display="flex" iscolumn={true}>
                  <Label htmlFor="numeroNota">
                    Número da nota: <span style={{ color: "red" }}>*</span>
                  </Label>
                  <FlexContainer>
                    <Input
                      type="text"
                      placeholder="12345678"
                      value={nota.numeroNota}
                      onChange={handleNotaFiscalInputChange(
                        index,
                        "numeroNota"
                      )}
                    />
                  </FlexContainer>
                  {errors[`numeroNota_${index}`] && (
                    <ErrorMessage>{errors[`numeroNota_${index}`]}</ErrorMessage>
                  )}
                </FlexContainer>
                <FlexContainer display="flex" iscolumn={true}>
                  <Label htmlFor="valorNota">
                    Valor da nota: <span style={{ color: "red" }}>*</span>
                  </Label>
                  <FlexContainer>
                    <PrefixSymbol>R$</PrefixSymbol>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="1000,00"
                      value={nota.valorNota}
                      onChange={handleNotaFiscalInputChange(index, "valorNota")}
                    />
                  </FlexContainer>
                  {errors[`valorNota_${index}`] && (
                    <ErrorMessage>{errors[`valorNota_${index}`]}</ErrorMessage>
                  )}
                </FlexContainer>
                {(!isFreteCalculado || !!form.id) && (
                  <DeleteButton
                    onClick={() => handleRemoveNotaFiscal(index)}
                    style={{
                      width: 32,
                      height: 32,
                      alignSelf: "center",
                      padding: 8,
                      marginTop: 9,
                    }}
                  >
                    <FaTrash />
                  </DeleteButton>
                )}
              </NotasContainer>
            ))}
          </NotasListContainer>
        )}
        <FlexWrapper>
          <FlexContainer marginright={16} display="flex" iscolumn={true}>
            <Label htmlFor="quantidadeVolumes">
              Quantidade de volumes: <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="1"
              value={form.quantidadeVolumes}
              onChange={handleInputChange("quantidadeVolumes")}
            />
            {errors.quantidadeVolumes && (
              <ErrorMessage>{errors.quantidadeVolumes}</ErrorMessage>
            )}
          </FlexContainer>
          {(isFreteCalculado || (!!form.id && !isEditado)) && (
            <FlexContainer display="flex" iscolumn={true}>
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
          {isFreteCalculado || !isEditado ? (
            <SaveButton onClick={onClose}>Concluir</SaveButton>
          ) : (
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
