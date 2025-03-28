import React, { useState, useEffect } from "react";
import { Popup, PopupContent, Button, Input, DeleteButton, AcaoConteiner, InputContainer, Label, FlexWrapper, SufixSymbol, PrefixSymbol, FlexContainer, SaveButton } from "../../../shared/styled";
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

  const handleSave = () => {
    onSave({ ...form, valorMaximoNota: stringToFloat(form.valorMaximoNota) || 0, porcentagemCobranca: stringToFloat(form.porcentagemCobranca) || 0 }, form);
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

  if (!isOpen) return null;

  return (
    <Popup>
      <PopupContent>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <FiX size={24} onClick={onClose} style={{ cursor: "pointer" }} />
        </div>
        <h3>{form.id ? "Editar Cliente" : "Novo Cliente"}</h3>
        <InputContainer>
          <Label htmlFor="nomeEmpresa">Nome empresa:</Label>
          <Input
            type="text"
            placeholder="Nome Empresa"
            value={form.nomeEmpresa}
            onChange={(e) => setForm({ ...form, nomeEmpresa: e.target.value })}
          />
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor="endereco">Endereço:</Label>
          <Input
            type="text"
            placeholder="Endereço"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />
        </InputContainer>
        
        <InputContainer>
          <Label htmlFor="cidade">Cidade:</Label>
          <Input
            type="text"
            placeholder="Cidade"
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
          />
        </InputContainer>
        
        <FlexWrapper>
          <FlexContainer marginRight={16} display="flex" column>
            <Label htmlFor="valorMaximoNota">Valor máx. nota:</Label>
            <FlexContainer>
              <PrefixSymbol>R$</PrefixSymbol>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="1000,00"
                value={form.valorMaximoNota}
                onChange={(e) => setForm({ ...form, valorMaximoNota: e.target.value })}
              />
            </FlexContainer>
          </FlexContainer>
          <FlexContainer marginRight={16} display="flex" column style={{maxWidth: 143}}>
            <Label htmlFor="porcentagemCobranca">Porcentagem cobrança:</Label>
            <FlexContainer>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="5"
                value={form.porcentagemCobranca}
                onChange={(e: any) => setForm({ ...form, porcentagemCobranca: e.target.value })}
              />
              <SufixSymbol>%</SufixSymbol>
            </FlexContainer>
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
                  <Label htmlFor="cidade">Nome cidade:</Label>
                    <Input
                      type="text"
                      placeholder="Cidade"
                      value={frete.cidade}
                      onChange={(e) => handleFreteChange(index, "cidade", e.target.value)}
                    />
                </FlexContainer>
                <FlexContainer display="flex" column style={{maxWidth: 134}}>
                  <Label htmlFor="valor">Valor frete p/ cidade:</Label>
                  <FlexContainer>
                    <PrefixSymbol>R$</PrefixSymbol>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="100,00"
                      value={frete.valor}
                      onChange={(e) => handleFreteChange(index, "valor", e.target.value)}
                    />
                  </FlexContainer>
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
