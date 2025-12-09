import React, { useState } from "react";
import { BackgroundBlobs } from "../components/background";
import { AuthInput } from "../components/Authentication/input";
import { useTheme } from "../components/theme/theme-context";
import { ThemeToggle } from "../components/theme/theme-toggle";

const API_URL = "http://localhost/tcc-axii/Project-Axii-Web/api/api/register.php";

export default function RegisterScreen() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setAlert({ type: "error", message: "Preencha todos os campos" });
      return false;
    }

    if (formData.name.length < 3) {
      setAlert({ type: "error", message: "Nome deve ter pelo menos 3 caracteres" });
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setAlert({ type: "error", message: "E-mail inválido" });
      return false;
    }

    if (formData.password.length < 6) {
      setAlert({ type: "error", message: "Senha deve ter pelo menos 6 caracteres" });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: "error", message: "As senhas não coincidem" });
      return false;
    }

    if (!acceptTerms) {
      setAlert({ type: "error", message: "Aceite os termos de uso para continuar" });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setAlert(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Salvar token e dados do usuário
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setAlert({
          type: "success",
          message: "Cadastro realizado com sucesso! Redirecionando...",
        });

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setAlert({
          type: "error",
          message: data.message || "Erro ao realizar cadastro",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "Erro de conexão com o servidor. Tente novamente.",
      });
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className={`min-h-screen w-screen fixed inset-0 overflow-auto ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      <BackgroundBlobs darkMode={darkMode} />
      <ThemeToggle />

      {/* Register Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div
          className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className="p-8 text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                darkMode
                  ? "bg-blue-600"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600"
              }`}
            >
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
            <h1
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Criar Conta
            </h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Junte-se ao Sistema de Gerenciamento
            </p>
          </div>

          {/* Body */}
          <div className="px-8 pb-8">
            {/* Alert */}
            {alert && (
              <div
                className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                  alert.type === "success"
                    ? darkMode
                      ? "bg-green-900/30 text-green-400"
                      : "bg-green-50 text-green-700"
                    : darkMode
                    ? "bg-red-900/30 text-red-400"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {alert.type === "success" ? (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
                <span>{alert.message}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Nome */}
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nome Completo
                </label>
                <div className="relative">
                  <AuthInput
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="João da Silva"
                  />
                  <svg
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  E-mail
                </label>
                <div className="relative">
                  <AuthInput
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="seu@email.com"
                  />
                  <svg
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>

              {/* Senha */}
              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Senha
                </label>
                <div className="relative">
                  <AuthInput
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="••••••••"
                  />
                  <svg
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Confirmar Senha
                </label>
                <div className="relative">
                  <AuthInput
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder="••••••••"
                  />
                  <svg
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                      darkMode
                        ? "text-gray-400 hover:text-gray-300"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    aria-label={
                      showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Termos */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className={`ml-2 text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Eu concordo com os{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Termos de Uso
                  </a>{" "}
                  e{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Política de Privacidade
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98]"
                } shadow-lg`}
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div
                className={`absolute inset-0 flex items-center ${
                  darkMode ? "text-gray-600" : "text-gray-300"
                }`}
              >
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-4 ${
                    darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"
                  }`}
                >
                  ou
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div
              className={`text-center text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Já tem uma conta?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Faça login
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}