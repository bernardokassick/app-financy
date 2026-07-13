import { DynamicIcon } from "@/components/DynamicIcon";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface TransactionItemProps {
  title: string;
  date: string;
  category: string;
  value: number;
  type: 'income' | 'outcome';
  iconName: string;
  color: string;
}

export function TransactionItem({ title, date, category, value, type, iconName, color }: TransactionItemProps) {
  const isIncome = type === 'income';

  const formattedValue = formatCurrency(value);

  return (
    <div className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl ${color.split(' ')[0]} bg-opacity-20`}>
          <DynamicIcon name={iconName} className={`w-5 h-5 ${color.split(' ')[1]}`} />
        </div>
        
        <div>
          <p className="text-sm font-bold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400 font-medium">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className={`px-4 py-1 rounded-full text-[11px] font-bold ${color}`}>
          {category}
        </span>

        <div className="flex items-center gap-2 min-w-27.5 justify-end">
          <span className={`text-sm font-bold ${isIncome ? "text-gray-800" : "text-gray-800"}`}>
            {isIncome ? `+ ${formattedValue}` : `- ${formattedValue}`}
          </span>
          {isIncome ? (
            <ArrowUpCircle className="w-4 h-4 text-success" />
          ) : (
            <ArrowDownCircle className="w-4 h-4 text-danger" />
          )}
        </div>
      </div>
    </div>
  );
}