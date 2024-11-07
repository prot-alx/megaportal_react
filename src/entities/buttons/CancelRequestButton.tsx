import { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useCancelRequestMutation } from "@/app/services/requestApi";
import { Button } from "@/shared/components/ui/button";

interface CancelRequestButtonProps {
  requestId: number;
}

export const CancelRequestButton: React.FC<CancelRequestButtonProps> = ({
  requestId,
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [
    cancelRequest,
    { isLoading: isCancelLoading, isError: isCancelError },
  ] = useCancelRequestMutation();

  const handleCancelRequest = useCallback(async () => {
    try {
      await cancelRequest(requestId).unwrap();
    } catch (error) {
      console.error("Failed to cancel request:", error);
    }
  }, [cancelRequest, requestId]);

  const handleAlertCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAlertOpen(false);
  };

  const handleAlertConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAlertOpen(false);
    handleCancelRequest();
  };

  const openAlert = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsAlertOpen(true);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {!isCancelLoading && !isCancelError && (
              <Button
                className="w-[110px]"
                type="button"
                variant="destructive"
                onClick={openAlert}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openAlert(e);
                  }
                }}
              >
                Отказ
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>Отменить заявку</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent
          className="w-[300px]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Вы уверены, что хотите отменить заявку? Это действие необратимо.
          </AlertDialogDescription>
          <AlertDialogFooter className="gap-10">
            <AlertDialogCancel onClick={handleAlertCancel}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertConfirm}>
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
