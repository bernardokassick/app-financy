import { Tag, Utensils, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/DynamicIcon";

interface CategorySummaryProps {
  title: string;
  value: string | number;
  variant: "purple" | "green" | "blue";
  iconName?: string;
  customColor?: string;
}

export function CategorySummaryCard({ title, value, variant, iconName, customColor }: CategorySummaryProps) {
  const configs = {
    purple: { icon: Tag, color: "text-[#1E293B]" }, 
    green: { icon: ArrowUpDown, color: "text-[#9333EA]" },
    blue: { icon: Utensils, color: "text-[#2563EB]" },
  };

  const { icon: DefaultIcon, color: defaultTextColor } = configs[variant];

  const textIconColor = customColor 
    ?.split(' ')
    .find(cls => cls.startsWith('text-')) || defaultTextColor;

  return (
    <Card className="shadow-none border border-gray-200 bg-white rounded-2xl p-6 h-full font-inter">
      <CardContent className="p-0 flex flex-col justify-center h-full">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center ${textIconColor}`}>
            {iconName ? (
              <DynamicIcon 
                name={iconName} 
                size={32} 
                strokeWidth={2.5}
              />
            ) : (
              <DefaultIcon 
                size={32} 
                strokeWidth={2.5}
              />
            )}
          </div>
          
          <h2 className={`text-[32px] font-bold text-[#1E293B] leading-none tracking-tight`}>
            {value}
          </h2>
        </div>

        <div className="mt-2 ml-12"> 
          <p className="text-[11px] font-bold text-[#64748B] tracking-widest uppercase">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}