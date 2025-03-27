import React, { useState, useEffect } from "react";
import { Popup, PopupContent, Button, Input, DeleteButton, AcaoConteiner } from "../../../shared/styled";
import { Cliente } from "../../../models/Cliente";
import { FretePorCidade } from "../../../models/FretePorCidade";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ContainerFretesAdd, FreteContainer, FreteListContainer } from "./styled";

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
  valorMaximoNota: string | number;
  porcentagemCobranca: string | number;
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
    onSave({ ...form, valorMaximoNota: Number(form.valorMaximoNota) || 0, porcentagemCobranca: Number(form.porcentagemCobranca) || 0 }, form);
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
        <h3>{form.id ? "Editar Cliente" : "Novo Cliente"}</h3>
        <Input type="text" placeholder="Nome Empresa" value={form.nomeEmpresa} onChange={(e) => setForm({ ...form, nomeEmpresa: e.target.value })} /><br />
        <Input type="text" placeholder="Endereço" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /><br />
        <Input type="text" placeholder="Cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} /><br />
        <Input type="text" placeholder="Valor Máximo Nota" value={form.valorMaximoNota} onChange={(e) => setForm({ ...form, valorMaximoNota: e.target.value })} /><br />
        <Input type="text" placeholder="% Cobrança" value={form.porcentagemCobranca} onChange={(e) => setForm({ ...form, porcentagemCobranca: e.target.value })} /><br />
        <ContainerFretesAdd>
          <h4>Fretes por Cidade</h4>
          <Button onClick={handleAddFrete}>
            <FaPlus />
          </Button>
        </ContainerFretesAdd>
        {(form.valorFretePorCidade && form.valorFretePorCidade.length > 0) &&
          <FreteListContainer>
            {form.valorFretePorCidade.map((frete, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <FreteContainer key={index}>
                <Input
                  type="text"
                  placeholder="Cidade"
                  value={frete.cidade}
                  onChange={(e) => handleFreteChange(index, "cidade", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Valor"
                  value={frete.valor}
                  onChange={(e) => handleFreteChange(index, "valor", e.target.value)}
                />
                <DeleteButton onClick={() => handleRemoveFrete(index)} style={{margin: 8, marginInline: 0}}>
                  <FaTrash />
                </DeleteButton>
              </FreteContainer>
            ))}
          </FreteListContainer>
        }
        <AcaoConteiner>
          <Button onClick={handleSave}>Salvar</Button>
          <Button onClick={onClose}>Cancelar</Button>
        </AcaoConteiner>
      </PopupContent>
    </Popup>
  );
};

export default ClienteFormPopup;
