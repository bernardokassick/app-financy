import { useState } from "react"
import { Mail, Lock, Eye, UserPlus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import logo from "../../assets/Logo.svg"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "@/stores/auth"

export function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const login = useAuthStore((state) => state.login)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const success = await login({ email, password })
            if (success) {
                toast.success("Login realizado com sucesso!")
                navigate("/dashboard")
            } else {
                toast.error("Credenciais inválidas.")
            }
        } catch (error) {
            toast.error("Erro ao conectar com o servidor: " + (error instanceof Error ? error.message : ""))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-6">
            <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Financy logo" />
            </div>

            <Card className="w-full max-w-110 border-gray-200 shadow-sm rounded-2xl pt-8 pb-4">
                <div className="text-center mb-6 px-6">
                    <h2 className="text-xl font-bold text-gray-800">Fazer login</h2>
                    <p className="text-sm text-gray-500">Entre na sua conta para continuar</p>
                </div>

                <CardContent className="px-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-semibold">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="mail@exemplo.com"
                                    className="pl-10 h-12 border-gray-300 focus-visible:ring-brand-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-semibold">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    className="pl-10 h-12 border-gray-300 focus-visible:ring-brand-base"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" />
                                <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer">
                                    Lembrar-me
                                </label>
                            </div>
                            <Link to="/recover" className="text-sm font-semibold text-brand-base hover:underline">
                                Recuperar senha
                            </Link>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-brand-base hover:bg-brand-dark text-white font-bold rounded-lg transition-all"
                            disabled={loading}
                        >
                            {loading ? "Processando..." : "Entrar"}
                        </Button>

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400">ou</span>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-500 mb-4">Ainda não tem uma conta?</p>

                        <Button variant="outline" className="w-full h-12 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 flex gap-2" asChild>
                            <Link to="/signup">
                                <UserPlus className="w-4 h-4" />
                                Criar conta
                            </Link>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}