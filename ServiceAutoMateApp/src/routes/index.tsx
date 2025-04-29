import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Clientes from "../pages/clientes";
import Solicitacoes from "../pages/solicitacoes";
import Menu from "../components/Menu";
import Monitoramento from "../pages/monitoramento";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Home title="Service AutoMate" />} />
        <Route path="/clientes" element={<Clientes title="Clientes" />} />
        <Route
          path="/solicitacoes"
          element={<Solicitacoes title="Solicitações de Serviço" />}
        />
        <Route path="/monitoramento" element={<Monitoramento title="Monitoramento" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
