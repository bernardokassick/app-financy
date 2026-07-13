import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Você tem certeza?",
  description = "Esta ação não pode ser desfeita e os dados serão removidos permanentemente.",
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl p-8 font-inter outline-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-gray-800">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 font-medium">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel 
            disabled={isLoading}
            className="rounded-xl border-gray-200 h-12 font-bold px-6"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 rounded-xl h-12 font-bold px-6 text-white border-none min-w-30"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}