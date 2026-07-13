import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types";

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  categories: Category[];
}

export function TransactionFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  categoryId,
  onCategoryChange,
  categories,
}: TransactionFiltersProps) {
  const sharedClasses = "py-[14px] border-gray-200 rounded-xl focus:ring-brand-base";

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-sm font-inter items-end">
      
      <div className="flex flex-col space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          Buscar
        </label>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por descrição"
            className={`w-full pl-10 ${sharedClasses} focus-visible:ring-brand-base text-sm font-medium placeholder:text-gray-400`}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          Tipo
        </label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className={`w-full ${sharedClasses} font-medium text-gray-600 flex items-center`}>
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Entrada</SelectItem>
            <SelectItem value="outcome">Saída</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          Categoria
        </label>
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger className={`w-full ${sharedClasses} font-medium text-gray-600 flex items-center`}>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          Período
        </label>
        <Select defaultValue="current">
          <SelectTrigger className={`w-full ${sharedClasses} font-medium text-gray-600 flex items-center`}>
            <SelectValue placeholder="Novembro / 2025" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Novembro / 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}