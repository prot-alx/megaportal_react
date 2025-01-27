import { createSocket } from "@/shared/lib/socket/socket";
import { Middleware } from "@reduxjs/toolkit";
import { requestsApi } from "../../services/request.api";
import { employeeApi } from "../../services/employee.api";

export const socketMiddleware: Middleware = (store) => {
  const socket = createSocket();

  socket.on("changes", (message) => {
    console.log('WebSocket update received:', message);
    if (message.path.includes("request")) {
      console.log('Invalidating requests cache');
      store.dispatch(
        requestsApi.util.invalidateTags([
          { type: "Requests" as const, id: "LIST" },
        ])
      );
    }
    if (message.path.includes("employee")) {
      console.log('Invalidating employee cache');
      store.dispatch(
        employeeApi.util.invalidateTags([
          { type: "Employee" as const, id: "LIST" },
        ])
      );
    }
  });

  return (next) => (action) => next(action);
};
