import React, { useState, useEffect } from "react";
import { Popup, PopupContent, Button, Input, DeleteButton, AcaoConteiner, InputContainer, Label, FlexWrapper, SufixSymbol, PrefixSymbol, FlexContainer, SaveButton, ErrorMessage } from "../../../shared/styled";
import { Cliente } from "../../../models/Cliente";
import { FretePorCidade } from "../../../models/FretePorCidade";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { ContainerFretesAdd, FreteContainer, FreteListContainer } from "./styled";
import { stringToFloat } from "../../../utils";

interface ClienteFormPopupProps {
  cliente?: Cliente;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: Cliente, form: FormState) => void;
}

type FormState = {
  id: string;
  nomeEmpresa: string;
  endereco: string;
  cidade: string;
  valorMaximoNota: string;
  porcentagemCobranca: string;
  valorFretePorCidade: FretePorCidade[] | null;
};

const ClienteFormPopup: React.FC<ClienteFormPopupProps> = ({ cliente, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<FormState>({
    id: "",
    nomeEmpresa: "",
    endereco: "",
    cidade: "",
    valorMaximoNota: "",
    porcentagemCobranca: "",
    valorFretePorCidade: null
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (cliente) {
      setForm({
        ...cliente,
        porcentagemCobranca: cliente.porcentagemCobranca.toString(),
        valorMaximoNota: cliente.valorMaximoNota.toString(),
        valorFretePorCidade: cliente.valorFretePorCidade ?? null
      });
    } else {
      setForm({
        id: "",
        nomeEmpresa: "",
        endereco: "",
        cidade: "",
        valorMaximoNota: "",
        porcentagemCobranca: "",
        valorFretePorCidade: null
      });
    }
  }, [cliente]);

  interface FormErrors {
    [key: string]: string;
  }
  
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
  
    if (!form.nomeEmpresa) {
      newErrors.nomeEmpresa = 'Nome do cliente é obrigatório.';
    } else if (form.nomeEmpresa.length < 3) {
      newErrors.nomeEmpresa = 'Nome do cliente deve ter pelo menos 3 caracteres.';
    }
  
    if (!form.endereco) {
      newErrors.endereco = 'Endereço do cliente é obrigatório.';
    } else if (form.endereco.length < 3) {
      newErrors.endereco = 'Endereço do cliente deve ter pelo menos 3 caracteres.';
    }
  
    if (!form.cidade) {
      newErrors.cidade = 'Cidade do cliente é obrigatória.';
    } else if (form.cidade.length < 3) {
      newErrors.cidade = 'Cidade do cliente deve ter pelo menos 3 caracteres.';
    }
  
    if (!form.valorMaximoNota) {
      newErrors.valorMaximoNota = 'Valor máximo nota é obrigatório.';
    } else if (stringToFloat(form.valorMaximoNota) <= 0) {
      newErrors.valorMaximoNota = 'Valor máximo nota deve ser maior que zero.';
    }
  
    if (!form.porcentagemCobranca) {
      newErrors.porcentagemCobranca = 'Valor porcentagem da cobrança é obrigatório.';
    } else if (stringToFloat(form.porcentagemCobranca) <= 0) {
      newErrors.porcentagemCobranca = 'Valor porcentagem da cobrança deve ser maior que zero.';
    }
  
    if (form.valorFretePorCidade && form.valorFretePorCidade.length > 0) {
      form.valorFretePorCidade.forEach((frete, index) => {
        if (!frete.cidade) {
          newErrors[`freteCidade_${index}`] = 'Nome da cidade é obrigatório.';
        } else if (frete.cidade.length < 3) {
          newErrors[`freteCidade_${index}`] = 'Nome da cidade deve ter pelo menos 3 caracteres.';
        }
  
        if (!frete.valor) {
          newErrors[`freteValor_${index}`] = 'Valor frete é obrigatório.';
        } else if (stringToFloat(frete.valor.toString()) <= 0) {
          newErrors[`freteValor_${index}`] = 'Valor frete deve ser maior que zero.';
        }
      });
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSave = () => {
    const errors = validateForm();  
    if (Object.keys(errors).length <= 0) {
      onSave({ ...form, valorMaximoNota: stringToFloat(form.valorMaximoNota) || 0, porcentagemCobranca: stringToFloat(form.porcentagemCobranca) || 0 }, form);
    }
  };

  const handleAddFrete = () => {
    setForm((prev) => ({
      ...prev,
      valorFretePorCidade: [...(prev.valorFretePorCidade ?? [])].concat({ cidade: "", valor: "" }),
    }));
  };

  const handleRemoveFrete = (index: number) => {
    setForm((prev) => ({
      ...prev,
      valorFretePorCidade: (prev.valorFretePorCidade ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleFreteChange = (index: number, key: string, value: string | number) => {
    setForm((prev) => {
      const updatedFretes = (prev.valorFretePorCidade ?? []).map((frete, i) =>
        i === index ? { ...frete, [key]: value } : frete
      );
      return { ...prev, valorFretePorCidade: updatedFretes };
    });
  };

  const handleFreteInputChange = (index: number, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFreteChange(index, field, e.target.value);
    if (e.target.value !== '') {
      setErrors((prevErrors: any) => ({ ...prevErrors, [`frete${field.charAt(0).toUpperCase() + field.slice(1)}_${index}`]: null }));
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    if (e.target.value !== '') {
      setErrors((prevErrors: any) => ({ ...prevErrors, [field]: null }));
    }
  };

  if (!isOpen) return null;

  return (
    <Popup>
      <PopupContent>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <FiX size={24} onClick={onClose} style={{ cursor: "pointer" }} />
        </div>
        <h3>{form.id ? "Editar Cliente" : "Novo Cliente"}</h3>
        <InputContainer>
          <Label htmlFor="nomeEmpresa">Nome do cliente: <span style={{ color: "red" }}>*</span></Label>
          <Input
            type="text"
            placeholder="Nome da Empresa"
            value={form.nomeEmpresa}
            onChange={handleInputChange('nomeEmpresa')}
          />
          {errors.nomeEmpresa && <ErrorMessage>{errors.nomeEmpresa}</ErrorMessage>}
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor="endereco">Endereço do cliente: <span style={{ color: "red" }}>*</span></Label>
          <Input
            type="text"
            placeholder="Endereço"
            value={form.endereco}
            onChange={handleInputChange('endereco')}
          />
          {errors.endereco && <ErrorMessage>{errors.endereco}</ErrorMessage>}
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor="cidade">Cidade do cliente: <span style={{ color: "red" }}>*</span></Label>
          <Input
            type="text"
            placeholder="Cidade"
            value={form.cidade}
            onChange={handleInputChange('cidade')}
          />
          {errors.cidade && <ErrorMessage>{errors.cidade}</ErrorMessage>}
        </InputContainer>
        
        <FlexWrapper>
          <FlexContainer marginRight={16} display="flex" column>
            <Label htmlFor="valorMaximoNota">Valor máx. nota: <span style={{ color: "red" }}>*</span></Label>
            <FlexContainer>
              <PrefixSymbol>R$</PrefixSymbol>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="1000,00"
                value={form.valorMaximoNota}
                onChange={handleInputChange('valorMaximoNota')}
              />
            </FlexContainer>
            {errors.valorMaximoNota && <ErrorMessage>{errors.valorMaximoNota}</ErrorMessage>}
          </FlexContainer>
          <FlexContainer marginRight={16} display="flex" column style={{maxWidth: 143}}>
            <Label htmlFor="porcentagemCobranca">% cobrança: <span style={{ color: "red" }}>*</span></Label>
            <FlexContainer>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="5"
                value={form.porcentagemCobranca}
                onChange={handleInputChange('porcentagemCobranca')}
              />
              <SufixSymbol>%</SufixSymbol>
            </FlexContainer>
            {errors.porcentagemCobranca && <ErrorMessage>{errors.porcentagemCobranca}</ErrorMessage>}
          </FlexContainer>
        </FlexWrapper>
        <ContainerFretesAdd>
          <h4>Fretes por cidade</h4>
          <Button onClick={handleAddFrete}>
            <FaPlus />
          </Button>
        </ContainerFretesAdd>
        {(form.valorFretePorCidade && form.valorFretePorCidade.length > 0) &&
          <FreteListContainer>
            {form.valorFretePorCidade.map((frete, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <FreteContainer key={index}>
                <FlexContainer display="flex" column>
                  <Label htmlFor="cidade">Nome cidade: <span style={{ color: "red" }}>*</span></Label>
                    <Input
                      type="text"
                      placeholder="Cidade"
                      value={frete.cidade}
                      onChange={handleFreteInputChange(index, "cidade")}
                    />
                    {errors[`freteCidade_${index}`] && <ErrorMessage>{errors[`freteCidade_${index}`]}</ErrorMessage>}
                </FlexContainer>
                <FlexContainer display="flex" column style={{maxWidth: 134}}>
                  <Label htmlFor="valor">Valor frete p/ cidade: <span style={{ color: "red" }}>*</span></Label>
                  <FlexContainer>
                    <PrefixSymbol>R$</PrefixSymbol>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="100,00"
                      value={frete.valor}
                      onChange={handleFreteInputChange(index, "valor")}
                    />
                  </FlexContainer>
                  {errors[`freteValor_${index}`] && <ErrorMessage>{errors[`freteValor_${index}`]}</ErrorMessage>}
                </FlexContainer>
                <DeleteButton
                  onClick={() => handleRemoveFrete(index)}
                  style={{width: 32, height: 32, alignSelf: "center", padding: 8, marginTop: 9}}
                >
                  <FaTrash />
                </DeleteButton>
              </FreteContainer>
            ))}
          </FreteListContainer>
        }
        <AcaoConteiner>
          <SaveButton onClick={handleSave}>Salvar</SaveButton>
          <DeleteButton onClick={onClose}>Cancelar</DeleteButton>
        </AcaoConteiner>
      </PopupContent>
    </Popup>
  );
};

export default ClienteFormPopup;
