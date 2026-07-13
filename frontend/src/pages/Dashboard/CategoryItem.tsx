import { Badge } from "@/components/ui/badge";

interface CategoryItemProps {
  label: string;
  color: string;
  items: number;
  total: string;
}

export function CategoryItem({ label, color, items, total }: CategoryItemProps) {

  return (
    <div className="flex items-center justify-between py-1 font-inter">
      <div className="flex items-center gap-3">
        <Badge 
          variant="secondary"
          className={`
            ${color}
            border-none rounded-full px-4 py-1
            font-bold text-[13px] shadow-none
            hover:opacity-80 transition-opacity cursor-default
          `}
        >
          {label}
        </Badge>
      </div>
      
      <div className="flex items-center gap-6">
        <p className="text-sm text-gray-400 font-medium whitespace-nowrap">
          {items} {items === 1 ? 'item' : 'itens'}
        </p>
        <p className="text-sm font-bold text-gray-800 min-w-22.5 text-right">
          {total}
        </p>
      </div>
    </div>
  );
}