import { useState } from "react"
import { Mail, Lock, Eye, User, LogIn } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import logo from "../../assets/Logo.svg"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"

export function SignupPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const signup = useAuthStore((state) => state.signup)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password.length < 8) {
            toast.error("A senha deve ter no mínimo 8 caracteres")
            return
        }

        setLoading(true)
        try {
            const success = await signup({ name, email, password })
            if (success) {
                toast.success("Conta criada com sucesso!")
                navigate("/dashboard")
            } else {
                toast.error("Erro ao realizar cadastro. Tente outro e-mail.")
            }
        } catch (error) {
            toast.error("Erro ao conectar com o servidor: " + (error instanceof Error ? error.message : ""))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center min-h-[calc(100vh-4rem)] justify-center flex-col gap-6">            
            <div className="flex items-center gap-2 mb-8">
                <img src={logo} alt="Financy logo" />
            </div>

            <Card className="w-full max-w-110 border-gray-200 shadow-sm rounded-2xl pt-8 pb-4">
                <div className="text-center mb-6 px-6">
                    <h2 className="text-xl font-bold text-gray-800">Criar conta</h2>
                    <p className="text-sm text-gray-500">Comece a controlar suas finanças ainda hoje</p>
                </div>

                <CardContent className="px-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-gray-700 font-semibold">Nome completo</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu nome completo"
                                    className="pl-10 h-11 border-gray-300 focus-visible:ring-brand-base"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-gray-700 font-semibold">E-mail</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="mail@exemplo.com"
                                    className="pl-10 h-11 border-gray-300 focus-visible:ring-brand-base"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-gray-700 font-semibold">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    className="pl-10 h-11 border-gray-300 focus-visible:ring-brand-base"
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
                            <p className="text-[10px] text-gray-400">A senha deve ter no mínimo 8 caracteres</p>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-11 mt-2 bg-brand-base hover:bg-brand-dark text-white font-bold rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Cadastrando..." : "Cadastrar"}
                        </Button>

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200"></span>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-400">ou</span>
                            </div>
                        </div>

                        <p className="text-center text-sm text-gray-500 mb-2">Já tem uma conta?</p>

                        <Button variant="outline" className="w-full h-11 border-gray-300 text-gray-700 font-semibold flex gap-2" asChild>
                            <Link to="/login">
                                <LogIn className="w-4 h-4" />
                                Fazer login
                            </Link>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}