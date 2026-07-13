import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpCircle, ArrowDownCircle, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories";
import { GET_DASHBOARD_DATA } from "@/lib/graphql/queries/Dashboard";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "@/lib/graphql/mutations/Transactions";
import type { Category, Transaction } from "@/types";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transactionToEdit?: Transaction | null;
  onSuccess?: () => void;
}

interface CategoriesData {
  getCategories: Category[];
}

export function UpsertTransactionDialog({ isOpen, setIsOpen, transactionToEdit, onSuccess }: Props) {
  const now = new Date();
  const [type, setType] = useState<"income" | "outcome">("outcome");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data: catData } = useQuery<CategoriesData>(GET_CATEGORIES);
  const categories = catData?.getCategories || [];

  useEffect(() => {
    if (transactionToEdit && isOpen) {
      setDescription(transactionToEdit.description);
      setAmount(String(transactionToEdit.amount));
      setType(transactionToEdit.type as "income" | "outcome");
      setCategoryId(transactionToEdit.category.id);
      
      const formattedDate = new Date(transactionToEdit.date).toISOString().split('T')[0];
      setDate(formattedDate);
    } else if (!isOpen) {
      resetForm();
    }
  }, [transactionToEdit, isOpen]);

  const [upsertTransaction, { loading }] = useMutation(
    transactionToEdit ? UPDATE_TRANSACTION : CREATE_TRANSACTION, 
    {
      refetchQueries: [
        { query: GET_DASHBOARD_DATA, variables: { month: now.getMonth() + 1, year: now.getFullYear() } },
        { query: GET_TRANSACTIONS, variables: { month: now.getMonth() + 1, year: now.getFullYear(), page: 1 } }
      ],
      onCompleted: () => {
        onSuccess?.();
        toast.success(transactionToEdit ? "Transação atualizada!" : "Transação criada!");
        setIsOpen(false);
        resetForm();
      },
      onError: (error) => {
        console.error("Erro ao processar transação:", error);
        toast.error("Erro ao salvar os dados.");
      }
    }
  );

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setDate("");
    setCategoryId("");
    setType("outcome");
  };

  const handleSave = () => {
    if (!description || !amount || !date || !categoryId) {
      return toast.warning("Preencha todos os campos obrigatórios.");
    }

    const variables = {
      data: {
        description,
        amount: Number(amount),
        date: new Date(date).toISOString(),
        type,
        categoryId
      },
      ...(transactionToEdit && { id: transactionToEdit.id })
    };

    upsertTransaction({ variables });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[450px] bg-white rounded-3xl p-8 shadow-2xl z-50 font-inter outline-none">
          
          <div className="flex items-center justify-between mb-1">
            <Dialog.Title className="text-xl font-bold text-gray-800">
              {transactionToEdit ? "Editar transação" : "Nova transação"}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600 border rounded-lg p-1">
              <X size={18} />
            </Dialog.Close>
          </div>
          <p className="text-sm text-gray-400 mb-6 font-medium">
            {transactionToEdit ? "Atualize os detalhes da sua transação" : "Registre sua despesa ou receita"}
          </p>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                className={`h-12 rounded-xl gap-2 font-bold transition-all ${type === 'outcome' ? "border-red-500 text-red-500 bg-red-50/50" : "border-gray-100 text-gray-400"}`}
                onClick={() => setType("outcome")}
              >
                <ArrowDownCircle size={18} /> Despesa
              </Button>
              <Button
                variant="outline"
                type="button"
                className={`h-12 rounded-xl gap-2 font-bold transition-all ${type === 'income' ? "border-green-500 text-green-500 bg-green-50/50" : "border-gray-100 text-gray-400"}`}
                onClick={() => setType("income")}
              >
                <ArrowUpCircle size={18} /> Receita
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Descrição</Label>
              <Input 
                placeholder="Ex. Almoço no restaurante" 
                className="h-12 rounded-xl border-gray-100" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Data</Label>
                <Input 
                  type="date" 
                  className="h-12 rounded-xl border-gray-100" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Valor</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">R$</span>
                  <Input 
                    type="number" 
                    placeholder="0,00" 
                    className="h-12 rounded-xl border-gray-100 pl-10" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categoria</Label>
              <Select onValueChange={setCategoryId} value={categoryId}>
                <SelectTrigger className="h-12 rounded-xl border-gray-100">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {categories.map((cat: Category) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full h-14 bg-brand-dark hover:bg-brand-base text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-dark/20"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}