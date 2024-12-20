import { RequestStatus } from "@/app/services/types/request.types";

export const statusTranslations: Record<RequestStatus, string> = {
  [RequestStatus.NEW]: "Новая",
  [RequestStatus.IN_PROGRESS]: "На исполнении",
  [RequestStatus.SUCCESS]: "На закрытии",
  [RequestStatus.CLOSED]: "Закрыта",
  [RequestStatus.CANCELLED]: "Отменена",
  [RequestStatus.MONITORING]: "На мониторинге",
  [RequestStatus.POSTPONED]: "Отложена",
};
