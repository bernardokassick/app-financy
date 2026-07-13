import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { CategoryItem } from "./CategoryItem";
import { TransactionItem } from "./TransactionItem";
import { CardContainer } from "./CardContainer";
import { SummaryCard } from "./SummaryCard";

import { GET_DASHBOARD_DATA } from "@/lib/graphql/queries/Dashboard";
import type { Category, Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UpsertTransactionDialog } from "../Transactions/UpsertTransactionDialog";

interface DashboardData {
  getTransactions: {
    transactions: Transaction[];
    total: number;
  };
  getCategories: Category[];
}

export function DashboardPage() {
  const now = new Date();
  const navigate = useNavigate();
  const [isUpsertDialogOpen, setIsUpsertDialogOpen] = useState(false);

  const { data, loading } = useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    variables: { 
      month: now.getMonth() + 1, 
      year: now.getFullYear() 
    },
    fetchPolicy: "cache-and-network"
  });

  const transactions = useMemo(() => data?.getTransactions?.transactions || [], [data]);
  const categories = useMemo(() => data?.getCategories || [], [data]);
  const recentTransactions = useMemo(() => transactions.slice(0, 10), [transactions]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.outcome += t.amount;
      return acc;
    }, { income: 0, outcome: 0 });
  }, [transactions]);

  const categoriesStats = useMemo(() => {
    return categories.map((cat) => {
      const catTransactions = transactions.filter((t) => t.category?.id === cat.id);
      const total = catTransactions.reduce((acc, t) => acc + t.amount, 0);
      return {
        ...cat,
        itemsCount: catTransactions.length || 0,
        totalValue: total || 0,
      };
    });
  }, [categories, transactions]);

  const isInitialLoading = loading && !data;

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 ${isInitialLoading ? 'opacity-50' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Saldo Total" amount={totals.income - totals.outcome} variant="balance" />
        <SummaryCard title="Receitas do Mês" amount={totals.income} variant="income" />
        <SummaryCard title="Despesas do Mês" amount={totals.outcome} variant="outcome" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CardContainer 
            title="Transações Recentes" 
            actionLabel="Ver todas"
            onActionClick={() => navigate("/transactions")}
            footer={
              <Button 
                variant="ghost" 
                className="w-full text-brand-base font-bold flex gap-2 hover:bg-brand-base/5 transition-all"
                onClick={() => setIsUpsertDialogOpen(true)}
              >
                <Plus className="w-4 h-4" /> Nova transação
              </Button>
            }
          >
            <div className="divide-y divide-gray-50">
              {recentTransactions.map((t: Transaction) => (
                <TransactionItem 
                  key={t.id}
                  title={t.description}
                  date={formatDate(t.date)}
                  category={t.category.name}
                  value={t.amount}
                  type={t.type}
                  iconName={t.category.icon}
                  color={t.category.color}
                />
              ))}
              {!isInitialLoading && recentTransactions.length === 0 && (
                <p className="py-10 text-center text-sm text-gray-400 italic">Nenhuma transação encontrada neste período.</p>
              )}
            </div>
          </CardContainer>
        </div>

        <CardContainer title="Categorias" actionLabel="Gerenciar" onActionClick={() => navigate("/categories")}>
          <div className="flex flex-col gap-4">
            {categoriesStats.map((cat) => (
              <CategoryItem 
                key={cat.id}
                label={cat.name}
                color={cat.color}
                items={cat.itemsCount}
                total={formatCurrency(cat.totalValue)}
              />
            ))}
          </div>
        </CardContainer>          
      </div>

      <UpsertTransactionDialog
        isOpen={isUpsertDialogOpen} 
        setIsOpen={setIsUpsertDialogOpen} 
      />
    </div>
  );
}