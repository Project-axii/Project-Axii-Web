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

  const getToken = () => {
    const token = localStorage.getItem("token");
    console.log("=== TOKEN DEBUG ===");
    console.log("Token encontrado:", !!token);
    console.log("Token preview:", token ? token.substring(0, 30) + "..." : "null");
    return token;
  };

  const getHeaders = (): HeadersInit => {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Header Authorization adicionado");
    } else {
      console.error("Token não encontrado - requisição sem autenticação!");
    }

    return headers;
  };

  const handleResponse = async (response: Response) => {
    console.log("=== RESPONSE DEBUG ===");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Headers:", Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log("Response body (raw):", text.substring(0, 500));

    if (!text || text.trim() === "") {
      throw new Error(`Resposta vazia do servidor (Status: ${response.status})`);
    }

    let data;
    try {
      data = JSON.parse(text);
      console.log("Response data (parsed):", data);
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      console.error("Texto recebido:", text);
      throw new Error("Resposta inválida do servidor (não é JSON válido)");
    }

    if (!response.ok) {
      const errorMsg = data.message || `Erro HTTP ${response.status}: ${response.statusText}`;
      
      if (response.status === 401) {
        console.error("Token inválido ou expirado - limpando sessão");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
      
      throw new Error(errorMsg);
    }

    return data;
  };

  const loadDevices = useCallback(async () => {
    const token = getToken();
    
    if (!token) {
      console.error("Usuário não autenticado");
      setError("Você precisa fazer login para acessar os dispositivos");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_URL}/devices/list.php`;
      console.log("=== FETCH DEVICES ===");
      console.log("URL:", url);
      console.log("Method: GET");
      console.log("Headers:", getHeaders());
      
      const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await handleResponse(response);

      if (data.success) {
        console.log("Dispositivos carregados:", data.total);
        setDevices(data.data || []);
      } else {
        const errorMsg = data.message || "Erro ao carregar dispositivos";
        setError(errorMsg);
        console.error("❌", errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão com o servidor";
      setError(errorMsg);
      console.error("Erro na requisição:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  const handleAddDevice = useCallback(async () => {
    if (!newDevice.nome || !newDevice.ip || !newDevice.tipo) {
      alert("Por favor, preencha os campos obrigatórios (Nome, IP, Tipo).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("=== ADD DEVICE ===");
      console.log("Data:", newDevice);
      
      const response = await fetch(`${API_URL}/devices/create.php`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newDevice),
      });

      const data = await handleResponse(response);

      if (data.success) {
        console.log("Dispositivo adicionado");
        setNewDevice({ nome: "", ip: "", tipo: "", sala: "", descricao: "" });
        setShowModal(false);
        await loadDevices();
        alert("Dispositivo adicionado com sucesso!");
      } else {
        const errorMsg = data.message || "Erro ao adicionar dispositivo";
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão com o servidor";
      setError(errorMsg);
      alert(errorMsg);
      console.error("❌", err);
    } finally {
      setLoading(false);
    }
  }, [newDevice, loadDevices]);

  const toggleDevice = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/devices/toggle.php`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id }),
      });

      const data = await handleResponse(response);

      if (data.success) {
        console.log("Status alterado");
        await loadDevices();
      } else {
        const errorMsg = data.message || "Erro ao alterar status";
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão com o servidor";
      setError(errorMsg);
      alert(errorMsg);
      console.error("❌", err);
    } finally {
      setLoading(false);
    }
  }, [loadDevices]);

  const updateStatus = useCallback(async (id: number, status: Device["status"]) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/devices/update.php`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ id, status }),
      });

      const data = await handleResponse(response);

      if (data.success) {
        console.log("Status atualizado");
        await loadDevices();
      } else {
        const errorMsg = data.message || "Erro ao atualizar status";
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão com o servidor";
      setError(errorMsg);
      alert(errorMsg);
      console.error("❌", err);
    } finally {
      setLoading(false);
    }
  }, [loadDevices]);

  const deleteDevice = useCallback(async (id: number) => {
    if (!window.confirm("Deseja realmente excluir este dispositivo?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/devices/delete.php`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ id }),
      });

      const data = await handleResponse(response);

      if (data.success) {
        console.log("Dispositivo excluído");
        await loadDevices();
        alert("Dispositivo excluído com sucesso!");
      } else {
        const errorMsg = data.message || "Erro ao excluir dispositivo";
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro de conexão com o servidor";
      setError(errorMsg);
      alert(errorMsg);
      console.error("❌", err);
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
    reloadDevices: loadDevices,
  };
}