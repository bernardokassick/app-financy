import { DynamicIcon } from "@/components/DynamicIcon";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { Transaction } from "@/types";

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  
  const colorParts = transaction.category.color.split(' ');
  const colorBase = colorParts[0] || 'bg-gray-100';
  const colorText = colorParts[1] || 'text-gray-500';

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group border-b border-gray-50 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorBase} bg-opacity-20 shadow-sm`}>
            <DynamicIcon name={transaction.category.icon} className={`w-5 h-5 ${colorText}`} />
          </div>
          <span className="text-sm font-bold text-gray-700">{transaction.description}</span>
        </div>
      </td>

      <td className="px-6 py-5 text-center text-xs text-gray-400 font-medium">
        {formatDate(transaction.date)}
      </td>

      <td className="px-6 py-5 text-center">
        <span className={`px-4 py-1.5 rounded-full text-[13px] font-bold ${transaction.category.color} bg-opacity-10`}>
          {transaction.category.name}
        </span>
      </td>

      <td className="px-6 py-5 text-center">
        <div className={`flex items-center justify-center gap-2 text-[11px] font-bold ${isIncome ? "text-green-500" : "text-red-500"}`}>
          {isIncome ? (
            <>
              <ArrowUpCircle size={16} />
              <span>Entrada</span>
            </>
          ) : (
            <>
              <ArrowDownCircle size={16} />
              <span>Saída</span>
            </>
          )}
        </div>
      </td>

      <td className="px-6 py-5 text-right text-sm font-bold text-gray-800">
        {isIncome ? `+ ${formatCurrency(transaction.amount)}` : `- ${formatCurrency(transaction.amount)}`}
      </td>

      <td className="px-6 py-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-xl border-gray-200 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
            onClick={() => onDelete(transaction)}
          >
            <Trash2 size={16} />
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-xl border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all"
            onClick={() => onEdit(transaction)}
          >
            <Edit size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}