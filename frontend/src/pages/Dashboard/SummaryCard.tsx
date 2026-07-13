import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  amount: number;
  variant: "balance" | "income" | "outcome";
}

export function SummaryCard({ title, amount, variant }: SummaryCardProps) {
  const config = {
    balance: { 
      icon: Wallet, 
      color: "text-[#9333EA]",
      bg: "bg-[#F3E8FF]"       
    },
    income: { 
      icon: ArrowUpCircle, 
      color: "text-[#19AD70]", 
      bg: "bg-[#E0FAE9]"       
    },
    outcome: { 
      icon: ArrowDownCircle, 
      color: "text-[#EF4444]",
      bg: "bg-[#FEE2E2]"
    },
  }[variant];

  const Icon = config.icon;

  const formattedAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);

  return (
    <Card className="shadow-none border-gray-200 bg-white rounded-2xl p-6">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-center gap-2">
          <div className={`${config.bg} p-1.5 rounded-lg flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase font-inter">
            {title}
          </span>
        </div>

        <div className="text-[32px] font-bold text-gray-800 leading-tight font-inter">
          {formattedAmount}
        </div>
      </CardContent>
    </Card>
  );
}