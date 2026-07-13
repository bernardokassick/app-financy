import { Trash2, PencilLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/DynamicIcon";
import type { Category } from "@/types";

interface CategoryCardProps {
  category?: Category;
  name: string;
  description: string;
  icon: string;
  color: string;
  itemsCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryCard({ name, description, icon, color, itemsCount, onEdit, onDelete }: CategoryCardProps) {

  console.log("CategoryCard renderizado com props:", { name, description, icon, color, itemsCount });

  return (
    <Card className="shadow-none border border-gray-200 rounded-2xl p-6 relative group bg-white font-inter">
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={onDelete}
          title="Excluir"
          className="p-2 text-danger bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={onEdit} 
          title="Editar"
          className="p-2 text-gray-400 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <PencilLine size={16} />
        </button>
      </div>

      <CardContent className="p-0 space-y-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.split(' ')[0]} bg-opacity-20`}>
          <DynamicIcon name={icon} className={`w-5 h-5 ${color.split(' ')[1]}`} />
        </div>

        <div>
          <h3 className="font-bold text-gray-800 text-lg leading-tight">{name}</h3>
          <p className="text-sm text-gray-400 font-medium line-clamp-2 mt-1 min-h-10">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge 
            variant="secondary"
            className={`
              ${color} 
              border-none rounded-full px-4 py-1
              font-bold text-[11px] shadow-none
            `}
          >
            {name}
          </Badge>
          <span className="text-sm text-gray-400 font-bold whitespace-nowrap">
            {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}