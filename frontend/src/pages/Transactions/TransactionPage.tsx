import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@apollo/client/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GET_TRANSACTIONS } from "@/lib/graphql/queries/Transactions";
import { GET_CATEGORIES } from "@/lib/graphql/queries/Categories";
import { DELETE_TRANSACTION_MUTATION } from "@/lib/graphql/mutations/Transactions";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionRow } from "./TransactionRow";
import { UpsertTransactionDialog } from "./UpsertTransactionDialog";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import type { Transaction } from "@/types";

interface TransactionsData {
  getTransactions: {
    transactions: Transaction[];
    total: number;
  };
}

export function TransactionsPage() {
  const now = new Date();
  
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(1);
  
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const itemsPerPage = 10;

  const { data, loading, refetch } = useQuery<TransactionsData>(GET_TRANSACTIONS, {
    variables: { 
      month: now.getMonth() + 1, 
      year: now.getFullYear(),
      search: search || undefined,
      type: type === "all" ? undefined : type,
      categoryId: categoryId === "all" ? undefined : categoryId,
      page: page 
    },
    fetchPolicy: "cache-and-network"
  });

  const { data: catData } = useQuery(GET_CATEGORIES);

  const [deleteTransaction, { loading: isDeleting }] = useMutation(DELETE_TRANSACTION_MUTATION, {
    onCompleted: () => {
      refetch();
      toast.success("Transação removida com sucesso!");
      setTransactionToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao excluir a transação.");
    }
  });

  const transactions = data?.getTransactions.transactions || [];
  const totalCount = data?.getTransactions.total || 0;
  const categories = catData?.getCategories || [];

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const firstItem = totalCount === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const lastItem = Math.min(page * itemsPerPage, totalCount);

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsUpsertDialogOpen(true);
  };

  const handleOpenNewTransaction = () => {
    setTransactionToEdit(null);
    setIsUpsertDialogOpen(true);
  };

  return (
    <div className="space-y-8 my-8 font-inter animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Transações</h1>
          <p className="text-sm text-gray-400 font-medium">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button 
          className="bg-brand-dark hover:bg-brand-base gap-2 rounded-xl px-6 font-bold h-12 transition-all shadow-md shadow-brand-dark/10"
          onClick={handleOpenNewTransaction}
        >
          <Plus size={18} /> Nova transação
        </Button>
      </div>

      <TransactionFilters 
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        type={type}
        onTypeChange={(val) => { setType(val); setPage(1); }}
        categoryId={categoryId}
        onCategoryChange={(val) => { setCategoryId(val); setPage(1); }}
        categories={categories}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">Descrição</th>
                <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest text-center">Data</th>
                <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest text-center">Categoria</th>
                <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest text-center">Tipo</th>
                <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && !data ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 animate-pulse font-medium">Sincronizando...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 font-medium">Nenhuma transação encontrada.</td></tr>
              ) : (
                transactions.map((t: Transaction) => (
                  <TransactionRow 
                    key={t.id} 
                    transaction={t} 
                    onEdit={handleEdit}
                    onDelete={setTransactionToDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-gray-50 flex items-center justify-between bg-white">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-tight">
            {firstItem} a {lastItem} | {totalCount} resultados
          </span>
          <div className="flex gap-2">
             <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-xl border-gray-100 text-gray-400"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
             >
               <ChevronLeft size={16} />
             </Button>
             {Array.from({ length: totalPages || 1 }).map((_, i) => (
               <Button 
                key={i}
                size="icon" 
                className={`h-9 w-9 rounded-xl font-bold text-sm ${page === i + 1 ? "bg-brand-dark text-white" : "bg-transparent text-gray-600 border border-gray-100"}`}
                onClick={() => setPage(i + 1)}
               >
                 {i + 1}
               </Button>
             ))}
             <Button 
              variant="outline" 
              size="icon" 
              className="h-9 w-9 rounded-xl border-gray-100 text-gray-400"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
             >
               <ChevronRight size={16} />
             </Button>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={!!transactionToDelete}
        onOpenChange={(open) => !open && setTransactionToDelete(null)}
        onConfirm={() => deleteTransaction({ variables: { id: transactionToDelete?.id } })}
        isLoading={isDeleting}
        title="Deseja excluir esta transação?"
        description={`A transação "${transactionToDelete?.description}" será removida permanentemente.`}
      />

      <UpsertTransactionDialog 
        isOpen={isUpsertDialogOpen} 
        setIsOpen={(open) => {
          setIsUpsertDialogOpen(open);
          if (!open) setTransactionToEdit(null);
        }}
        transactionToEdit={transactionToEdit}
      />
    </div>
  );
}