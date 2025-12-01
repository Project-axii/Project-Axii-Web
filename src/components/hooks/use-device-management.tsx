import { useState, useEffect, useCallback } from "react";

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
  data_cadastro?: string;
}

interface NewDevice {
  nome: string;
  ip: string;
  tipo: string;
  sala: string;
  descricao: string;
}

const API_URL = "http://localhost/tcc-axii/Project-Axii-Web/api/api";

export function useDeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newDevice, setNewDevice] = useState<NewDevice>({
    nome: "",
    ip: "",
    tipo: "",
    sala: "",
    descricao: "",
  });
  const [showModal, setShowModal] = useState(false);

  const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  const handleResponse = async (response: Response) => {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) throw new Error(data?.message || "Erro na API");
    return data;
  };

  const loadDevices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/devices/list.php`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await handleResponse(response);
      if (data?.success) setDevices(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar devices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleAddDevice = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/devices/create.php`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newDevice),
      });
      const data = await handleResponse(response);
      if (data.success) {
        setNewDevice({ nome: "", ip: "", tipo: "", sala: "", descricao: "" });
        setShowModal(false);
        await loadDevices();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao adicionar device");
    } finally {
      setLoading(false);
    }
  }, [newDevice, loadDevices]);

  const toggleDevice = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/devices/toggle.php`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id }),
      });
      const data = await handleResponse(response);
      if (data.success) {
        await loadDevices();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao alternar device");
    } finally {
      setLoading(false);
    }
  }, [loadDevices]);

  const updateStatus = useCallback(async (id: number, status: Device["status"]) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/devices/update.php`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id, status }),
      });
      const data = await handleResponse(response);
      if (data.success) await loadDevices();
    } catch (err) {
      alert("Erro ao atualizar status");
    } finally {
      setLoading(false);
    }
  }, [loadDevices]);

  const deleteDevice = useCallback(async (id: number) => {
    if (!window.confirm("Deseja excluir?")) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/devices/delete.php`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ id }),
      });
      const data = await handleResponse(response);
      if (data.success) await loadDevices();
    } catch {
      alert("Erro ao excluir device");
    } finally {
      setLoading(false);
    }
  }, [loadDevices]);

  return {
    devices,
    loading,
    error,
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