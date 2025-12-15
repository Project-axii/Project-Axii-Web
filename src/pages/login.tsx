import React, { useState } from "react";
import { BackgroundBlobs } from "../components/background";
import { ThemeToggle } from "../components/theme/theme-toggle";
import { useTheme } from "../components/theme/theme-context";

interface LoginScreenProps {
    onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
    const { darkMode } = useTheme();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [remember, setRemember] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleSubmit = async () => {
        if (!email || !password) {
            setAlert({ type: "error", message: "Preencha todos os campos" });
            return;
        }

        setIsLoading(true);
        setAlert(null);

        try {
            const apiUrl = 'http://localhost/tcc-axii/Project-axii-api/api/login.php';
            
            console.log('=== LOGIN DEBUG ===');
            console.log('URL:', apiUrl);
            console.log('Email:', email);
            console.log('Password:', password ? '***' : 'vazio');
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('Status da resposta:', response.status);
            
            const data = await response.json();
            console.log('Dados recebidos:', data);

            if (data.success) {
                setAlert({ type: "success", message: data.message });
                
                console.log('Salvando token:', data.token);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                const tokenSalvo = localStorage.getItem("token");
                console.log('Token verificado no localStorage:', tokenSalvo ? 'Salvo com sucesso' : 'ERRO ao salvar');
                
                if (!remember) {
                    console.log('Remember desmarcado - token será removido ao fechar o navegador');
                    sessionStorage.setItem("tempSession", "true");
                }

                setTimeout(() => {
                    onLogin();
                }, 500);
            } else {
                setAlert({ type: "error", message: data.message });
                console.error('Erro no login:', data.message);
            }
        } catch (error) {
            setAlert({ 
                type: "error", 
                message: "Erro ao conectar com o servidor" 
            });
            console.error('Erro na requisição:', error);
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
            className={`min-h-screen w-screen fixed inset-0 overflow-hidden ${
                darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"
            }`}
        >
            <BackgroundBlobs darkMode={darkMode} />
            <ThemeToggle />

            {/* Login Container */}
            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
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
                            <img className="w-15 h-15" src="https://lfcostldktmoevensqdj.supabase.co/storage/v1/object/public/axii/white-logo.svg" alt="" />
                        </div>
                        <h1
                            className={`text-3xl font-bold mb-2 ${
                                darkMode ? "text-white" : "text-gray-800"
                            }`}
                        >
                            Bem-vindo de volta!
                        </h1>
                        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Sistema de Gerenciamento de Sala de Aula
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
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="seu@email.com"
                                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                                            darkMode
                                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                                                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                                        }`}
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

                            {/* Password */}
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
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 pl-11 pr-11 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                                            darkMode
                                                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                                                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                                        }`}
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

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span
                                        className={`ml-2 text-sm ${
                                            darkMode ? "text-gray-300" : "text-gray-700"
                                        }`}
                                    >
                                        Lembrar-me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Esqueceu a senha?
                                </a>
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
                                {isLoading ? "Entrando..." : "Entrar"}
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

                        {/* Register Link */}
                        <div
                            className={`text-center text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            Não tem uma conta?{" "}
                            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                Cadastre-se
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