import { Plus } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { GET_DASHBOARD_DATA } from "@/lib/graphql/queries/Dashboard";
import { CategoryCard } from "./CategoryCard";
import { CategorySummaryCard } from "./CategorySummaryCard";
import { CategoryDialog } from "./CategoryDialog";
import { DELETE_CATEGORY_MUTATION } from "@/lib/graphql/mutations/Categories";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import type { Category, Transaction } from "@/types";

interface DashboardData {
  getTransactions: {
    transactions: Transaction[];
    total: number;
  };
  getCategories: Category[];
}

export function CategoriesPage() {
  const now = new Date();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string, name: string } | null>(null);

  const { data, loading, refetch } = useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    variables: { 
      month: now.getMonth() + 1, 
      year: now.getFullYear() 
    },
    fetchPolicy: "cache-and-network"
  });

  const [deleteCategory, { loading: isDeleting }] = useMutation(DELETE_CATEGORY_MUTATION, {
    onCompleted: () => {
      refetch();
      toast.success("Categoria excluída!");
      setCategoryToDelete(null);
    }
  });

  const handleCreateNew = () => {
    setCategoryToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsDialogOpen(true);
  };

  const categories = useMemo(() => data?.getCategories || [], [data]);
  const transactions = useMemo(() => data?.getTransactions?.transactions || [], [data]);

  // Lógica de estatísticas aprimorada para incluir ícone e cor
  const stats = useMemo(() => {
    if (transactions.length === 0 || categories.length === 0) {
      return { totalTx: 0, mostUsed: "Nenhuma", icon: undefined, color: undefined };
    }

    const counts = transactions.reduce((acc: Record<string, number>, t: Transaction) => {
      const id = t.category?.id;
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const mostUsedId = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), "");
    const mostUsedCategory = categories.find(c => c.id === mostUsedId);

    return {
      totalTx: transactions.length,
      mostUsed: mostUsedCategory?.name || "Nenhuma",
      icon: mostUsedCategory?.icon, 
      color: mostUsedCategory?.color 
    };
  }, [transactions, categories]);

  const isInitialLoading = loading && !data;

  return (
    <div className={`space-y-8 my-8 animate-in fade-in duration-500 font-inter ${isInitialLoading ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Categorias</h1>
          <p className="text-sm text-gray-400 font-medium">
            Organize suas transações por categorias
          </p>
        </div>
        
        <Button 
          onClick={handleCreateNew}
          className="bg-brand-dark hover:bg-brand-base gap-2 rounded-xl px-6 font-bold h-12 transition-all shadow-md shadow-brand-dark/10"
        >
          <Plus size={18} /> Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CategorySummaryCard 
          variant="purple"
          value={categories.length} 
          title="Total de categorias" 
        />
        <CategorySummaryCard 
          variant="green"
          value={stats.totalTx} 
          title="Total de transações" 
        />
        <CategorySummaryCard 
          variant="blue"
          value={stats.mostUsed} 
          title="Categoria mais utilizada"
          iconName={stats.icon}
          customColor={stats.color}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat: Category) => {
          const itemsInCat = transactions.filter(t => t.category?.id === cat.id).length;
          
          return (
            <CategoryCard 
              key={cat.id}
              name={cat.name}
              description={cat.description || "Sem descrição cadastrada."}
              icon={cat.icon}
              color={cat.color}
              itemsCount={itemsInCat}
              onEdit={() => handleEdit(cat)}
              onDelete={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
            />
          );
        })}
      </div>

      <ConfirmDeleteDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        onConfirm={() => deleteCategory({ variables: { id: categoryToDelete?.id } })}
        isLoading={isDeleting}
        title="Deseja excluir esta categoria?"
        description={`A categoria "${categoryToDelete?.name}" será removida permanentemente.`}
      />

      <CategoryDialog
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        categoryToEdit={categoryToEdit}
        onCreated={() => refetch()}
      />
    </div>
  );
}