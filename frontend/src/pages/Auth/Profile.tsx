import { useState } from "react"
import { User, Mail, LogOut, Loader2 } from "lucide-react"
import { useAuthStore } from "@/stores/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Layout } from "@/components/Layout"
import { useMutation } from "@apollo/client/react"
import { UPDATE_USER_MUTATION } from "@/lib/graphql/mutations/User"

export function ProfilePage() {
  const { user, logout, setUser } = useAuthStore()
  const [name, setName] = useState(user?.name || "")

  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: (data) => {
      const updatedUser = {
        id: user!.id,
        email: user!.email,
        ...user,
        name: (data as { updateUser: { name: string } }).updateUser.name
      };
      setUser(updatedUser);
      toast.success("Alterações salvas com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar perfil", {
        description: error.message,
      });
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("O nome não pode estar vazio");
    }

    if (name === user?.name) {
      return toast.info("Nenhuma alteração detectada.");
    }

    await updateUser({
      variables: {
        id: user?.id,
        data: { name }
      }
    });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-10 animate-in fade-in duration-500 font-inter">
        <Card className="w-full max-w-110 border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="pt-10 px-8 pb-8">
            <div className="flex flex-col items-center mb-8">
              <div className="h-20 w-20 rounded-full bg-gray-300 bg-opacity-10 flex items-center justify-center text-gray-800 text-2xl font-bold mb-4">
                {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-sm text-gray-500 font-medium">{user?.email}</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2 text-left">
                <Label htmlFor="name" className="text-gray-700 font-bold">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="pl-10 h-12 border-gray-300 focus-visible:ring-brand-base rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-gray-700 font-bold">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email}
                    disabled
                    className="pl-10 h-12 bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed rounded-xl"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium">O e-mail não pode ser alterado</p>
              </div>

              <div className="pt-4 space-y-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-brand-base hover:bg-brand-dark text-white font-bold rounded-xl transition-all shadow-md shadow-brand-base/20"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Salvar alterações"
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="outline" 
                  onClick={logout}
                  className="w-full h-12 border-gray-200 text-red-500 font-bold flex gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl"
                >
                  <LogOut className="w-4 h-4 rotate-180" />
                  Sair da conta
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}