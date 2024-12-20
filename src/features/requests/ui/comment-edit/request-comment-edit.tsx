import { useUpdateRequestCommentMutation } from "@/app/services/request.api";
import { Button, Dialog, DialogContent, DialogTitle } from "@/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAddBoxFill } from "@remixicon/react";
import { forwardRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CommentEditFormValues,
  commentEditSchema,
} from "../../lib/schemas/comment-edit.schema";
import { CommentForm } from "./comment-form";
import { Requests } from "@/app/services/types/request.types";
import { EmployeeSummaryDto } from "@/app/services/types/employee.types";

interface RequestEditProps {
  request: Requests;
  requestStatus: string;
  performer: EmployeeSummaryDto | null;
}

export const RequestCommentEdit = forwardRef<HTMLDivElement, RequestEditProps>(
  ({ request, requestStatus, performer }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [updateComment, { isLoading }] = useUpdateRequestCommentMutation();

    const form = useForm<CommentEditFormValues>({
      resolver: zodResolver(commentEditSchema),
      defaultValues: {
        comment: "",
      },
    });

    useEffect(() => {
      if (isOpen) {
        form.setValue("comment", "");
      }
    }, [isOpen, request, form.setValue]);

    const handleSubmit = async (data: CommentEditFormValues) => {
      try {
        await updateComment({ id: request.id, data }).unwrap();
        setIsOpen(false);
      } catch (error) {
        console.error("Ошибка при обновлении заявки:", error);
      }
    };

    if (requestStatus === "CLOSED" || requestStatus === "CANCELLED") {
      return null;
    }

    return (
      <div ref={ref}>
        <Button
          role="button"
          variant="outline"
          className="w-[40px] opacity-20 hover:opacity-100"
          onClick={() => setIsOpen(true)}
        >
          <RiAddBoxFill className="ml-auto min-h-6 min-w-6" />
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogTitle>
              Добавление комментария к заявке {request.client}
            </DialogTitle>
            <CommentForm
              {...form.formState}
              control={form.control}
              performer={performer}
              requestStatus={requestStatus}
              request={request}
              isLoading={isLoading}
              onClose={() => setIsOpen(false)}
              onSubmit={form.handleSubmit(handleSubmit)}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
);
