import { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DynamicIcon } from "@/components/DynamicIcon";
import { CATEGORY_COLORS } from "@/constants/categories";
import { CREATE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION } from "@/lib/graphql/mutations/Categories";

const ICON_OPTIONS = [
  "BriefcaseBusiness", "CarFront", "HeartPulse", "PiggyBank", "ShoppingCart", 
  "Ticket", "ToolCase", "Utensils", "PawPrint", "Home", 
  "Gift", "Dumbbell", "BookOpen", "BaggageClaim", "Mailbox", "ReceiptText"
];

export function CategoryDialog({ open, onOpenChange, onCreated, categoryToEdit }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);

  useEffect(() => {
    if (categoryToEdit && open) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || "");
      setSelectedIcon(categoryToEdit.icon || ICON_OPTIONS[0]);

      const colorObj = CATEGORY_COLORS.find(c => c.dbValue === categoryToEdit.color);
      if (colorObj) setSelectedColor(colorObj);
    } else if (open) {
      setName("");
      setDescription("");
      setSelectedIcon(ICON_OPTIONS[0]);
      setSelectedColor(CATEGORY_COLORS[0]);
    }
  }, [categoryToEdit, open]);

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY_MUTATION);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY_MUTATION);

  const loading = creating || updating;

  const handleSave = async () => {
    if (!name.trim()) return alert("O título é obrigatório.");

    const variables = {
      data: {
        name,
        description,
        icon: selectedIcon,
        color: selectedColor.dbValue,
      }
    };

    try {
      if (categoryToEdit) {
        await updateCategory({
          variables: {
            id: categoryToEdit.id,
            ...variables
          }
        });
      } else {
        await createCategory({ variables });
      }

      onCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Houve um erro ao salvar a categoria.");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-120 bg-white rounded-3xl p-8 shadow-2xl z-50 font-inter outline-none">
          
          <div className="flex items-center justify-between mb-1">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              {categoryToEdit ? "Editar categoria" : "Nova categoria"}
            </Dialog.Title>
            <Dialog.Close className="text-gray-400 hover:text-gray-600 border rounded-lg p-1">
              <X size={18} />
            </Dialog.Close>
          </div>
          <p className="text-sm text-gray-400 mb-8 font-medium">
            {categoryToEdit ? "Atualize os dados da sua categoria" : "Organize suas transações com categorias"}
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Título</Label>
              <Input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Alimentação" 
                className="rounded-xl h-12 border-gray-200" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Descrição</Label>
              <Input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição da categoria" 
                className="rounded-xl h-12 border-gray-200" 
              />
              <span className="text-[12px] text-gray-300">Opcional</span>
            </div>

            <div className="space-y-3">
              <Label className="text-[14px] font-medium text-gray-700">Ícone</Label>
              <div className="grid grid-cols-8 gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedIcon(icon)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
                      selectedIcon === icon 
                        ? "border-brand-dark bg-white ring-1 ring-brand-dark" 
                        : "border-gray-200 text-gray-400"
                    }`}
                  >
                    <DynamicIcon name={icon} className={`w-5 h-5 ${selectedIcon === icon ? "text-brand-dark" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[14px] font-medium text-gray-700">Cor</Label>
              <div className="grid grid-cols-7 gap-4 w-full">
                {CATEGORY_COLORS.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className="h-6 rounded-lg transition-all ring-1 ring-offset-4"
                      style={{
                        backgroundColor: color.hex,
                        outline: 'none',
                        ...({
                          "--tw-ring-color": isSelected ? color.hex : '#D1D5DB'
                        } as React.CSSProperties)
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-brand-dark hover:bg-brand-base text-white h-14 rounded-2xl font-bold text-lg mt-4"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}