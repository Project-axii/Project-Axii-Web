import { useState, useCallback } from "react";

interface Device {
  id: number;
  nome: string;
  ip: string;
  tipo: "computador" | "projetor" | "iluminacao" | "ar_condicionado" | "outro";
  sala: string;
  descricao: string;
  status: "online" | "offline" | "manutencao";
  ativo: boolean;
  ultima_conexao: string;
}

interface NewDevice {
  nome: string;
  ip: string;
  tipo: string;
  sala: string;
  descricao: string;
}

const initialDevices: Device[] = [
  {
    id: 1,
    nome: "PC-01-LAB",
    ip: "192.168.1.100",
    tipo: "computador",
    sala: "Laboratório 1",
    descricao: "Computador principal do laboratório",
    status: "online",
    ativo: true,
    ultima_conexao: new Date().toISOString(),
  },
  {
    id: 2,
    nome: "PROJETOR-LAB-01",
    ip: "192.168.1.105",
    tipo: "projetor",
    sala: "Laboratório 1",
    descricao: "Projetor multimídia 4K",
    status: "online",
    ativo: true,
    ultima_conexao: new Date().toISOString(),
  },
  {
    id: 3,
    nome: "AR-COND-LAB-01",
    ip: "192.168.1.110",
    tipo: "ar_condicionado",
    sala: "Laboratório 1",
    descricao: "Ar condicionado 24000 BTUs",
    status: "offline",
    ativo: false,
    ultima_conexao: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 4,
    nome: "LUZ-LAB-01",
    ip: "192.168.1.115",
    tipo: "iluminacao",
    sala: "Laboratório 1",
    descricao: "Sistema de iluminação LED",
    status: "online",
    ativo: true,
    ultima_conexao: new Date().toISOString(),
  },
  {
    id: 5,
    nome: "PROJETOR-SALA-A",
    ip: "192.168.1.101",
    tipo: "projetor",
    sala: "Sala A",
    descricao: "Projetor multimídia",
    status: "offline",
    ativo: true,
    ultima_conexao: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 6,
    nome: "PC-SALA-A-01",
    ip: "192.168.1.120",
    tipo: "computador",
    sala: "Sala A",
    descricao: "Computador da Sala A",
    status: "online",
    ativo: true,
    ultima_conexao: new Date().toISOString(),
  },
  {
    id: 7,
    nome: "AR-COND-02",
    ip: "192.168.1.102",
    tipo: "ar_condicionado",
    sala: "Sala B",
    descricao: "Ar condicionado 18000 BTUs",
    status: "manutencao",
    ativo: false,
    ultima_conexao: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function useDeviceManagement() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [newDevice, setNewDevice] = useState<NewDevice>({
    nome: "",
    ip: "",
    tipo: "",
    sala: "",
    descricao: "",
  });
  const [showModal, setShowModal] = useState(false);

  const handleAddDevice = useCallback(() => {
    if (!newDevice.nome || !newDevice.ip || !newDevice.tipo) {
      alert("Por favor, preencha os campos obrigatórios (Nome, IP, Tipo).");
      return;
    }

    const newId = devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1;
    const deviceToAdd: Device = {
      id: newId,
      nome: newDevice.nome,
      ip: newDevice.ip,
      tipo: newDevice.tipo as Device["tipo"],
      sala: newDevice.sala || "Não Atribuída",
      descricao: newDevice.descricao || "",
      status: "online",
      ativo: true,
      ultima_conexao: new Date().toISOString(),
    };

    setDevices(prevDevices => [...prevDevices, deviceToAdd]);
    setNewDevice({ nome: "", ip: "", tipo: "", sala: "", descricao: "" });
    setShowModal(false);
  }, [devices, newDevice]);

  const toggleDevice = useCallback((id: number) => {
    setDevices(prevDevices => prevDevices.map(d => d.id === id ? { ...d, ativo: !d.ativo } : d));
  }, []);

  const updateStatus = useCallback((id: number, status: Device["status"]) => {
    setDevices(prevDevices => prevDevices.map(d => d.id === id ? { ...d, status } : d));
  }, []);

  const deleteDevice = useCallback((id: number) => {
    if (window.confirm("Deseja realmente excluir este dispositivo?")) {
      setDevices(prevDevices => prevDevices.filter(d => d.id !== id));
    }
  }, []);

  return {
    devices,
    newDevice,
    setNewDevice,
    showModal,
    setShowModal,
    handleAddDevice,
    toggleDevice,
    updateStatus,
    deleteDevice,
  };
}
