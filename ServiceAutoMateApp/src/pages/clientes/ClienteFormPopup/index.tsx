import React, { useState, useEffect } from "react";
import { Popup, PopupContent, Button, Input } from "../styled";
import { AcaoConteiner } from "../ClienteTable/styled";
import { Cliente } from "../../../models/Cliente";

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
};

const ClienteFormPopup: React.FC<ClienteFormPopupProps> = ({ cliente, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<FormState>({
    id: "",
    nomeEmpresa: "",
    endereco: "",
    cidade: "",
    valorMaximoNota: "",
    porcentagemCobranca: "",
  });

  useEffect(() => {
    if (cliente) {
      setForm({ ...cliente, valorMaximoNota: cliente.valorMaximoNota.toString() });
    } else {
      setForm({
        id: "",
        nomeEmpresa: "",
        endereco: "",
        cidade: "",
        valorMaximoNota: "",
        porcentagemCobranca: "",
      });
    }
  }, [cliente]);

  const handleSave = () => {
    onSave({ ...form, valorMaximoNota: Number(form.valorMaximoNota) || 0, porcentagemCobranca: Number(form.porcentagemCobranca) || 0 }, form);
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
        <AcaoConteiner>
          <Button onClick={handleSave}>Salvar</Button>
          <Button onClick={onClose}>Cancelar</Button>
        </AcaoConteiner>
      </PopupContent>
    </Popup>
  );
};

export default ClienteFormPopup;
