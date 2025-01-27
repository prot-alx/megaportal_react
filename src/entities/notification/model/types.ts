export interface ChangeNotification {
  action: "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  data: unknown;
  initiator: {
    id: string;
    role: string;
  };
}
