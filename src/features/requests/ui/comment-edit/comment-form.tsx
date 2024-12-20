import { EmployeeSummaryDto } from "@/app/services/types/employee.types";
import { CommentEditFormValues } from "../../lib/schemas/comment-edit.schema";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Requests } from "@/app/services/types/request.types";
import { Button, LoadingSpinner, Textarea } from "@/shared";
import { StatusToggleGroup } from "./status-toggle-group";
import { statusTranslations } from "../../lib/constants/status-translations";

interface CommentFormProps {
  control: Control<CommentEditFormValues>;
  errors: FieldErrors<CommentEditFormValues>;
  performer: EmployeeSummaryDto | null;
  requestStatus: string;
  request: Requests;
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  control,
  errors,
  performer,
  requestStatus,
  request,
  isLoading,
  isSubmitting,
  onClose,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full h-[30px]">
      Текущий статус заявки: {statusTranslations[request.status]}
    </span>
    <Controller
      name="comment"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col space-y-1.5 items-center gap-4">
          <StatusToggleGroup
            performer={performer}
            requestStatus={requestStatus}
          />
          <Textarea
            id="comment"
            {...field}
            placeholder="Введите комментарий."
            className={errors.comment ? "border-red-500" : ""}
            autoComplete="off"
          />
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>
      )}
    />
    <div className="mt-4 flex justify-between">
      <Button variant="outline" className="w-28" onClick={onClose}>
        Отмена
      </Button>
      <Button
        type="submit"
        className="w-28"
        disabled={isLoading || isSubmitting}
      >
        {isLoading ? <LoadingSpinner /> : "Сохранить"}
      </Button>
    </div>
  </form>
);
