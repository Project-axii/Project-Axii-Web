import { useState, useEffect } from "react";

export function useApiUrl() {
  const [apiUrl, setApiUrl] = useState<string>("");

  useEffect(() => {
    const fetchApiUrl = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/Project-axii/sistema-redirecionamento/refs/heads/main/sistema.json"
        );
        const data = await response.json();

        if (data.status === "success" && data.link) {
          setApiUrl(data.link);
          console.log("URL da API carregada:", data.link);
        } else {
          setApiUrl("http://localhost/tcc-axii/Project-axii-api");
          console.warn("Link não encontrado no JSON, usando localhost");
        }
      } catch (error) {
        console.error("Erro ao buscar URL da API:", error);
        setApiUrl("http://localhost/tcc-axii/Project-axii-api");
      }
    };

    fetchApiUrl();
  }, []);

  return apiUrl;
}
