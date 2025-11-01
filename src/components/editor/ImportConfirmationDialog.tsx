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

interface ImportConfirmationDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  type: "document" | "template";
}

export function ImportConfirmationDialog({
  open,
  onConfirm,
  onCancel,
  type,
}: ImportConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Replace existing content?</AlertDialogTitle>
          <AlertDialogDescription>
            {type === "template"
              ? "This will replace all current content with the selected template. Are you sure you want to continue?"
              : "This will replace all current content with the imported file. Are you sure you want to continue?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

