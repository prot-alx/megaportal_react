import { useSocket } from "@/shared/lib/socket/hooks/use-socket";
import { SocketChangeMessage } from "@/shared/lib/socket/socket.types";
import { useEffect } from "react";

export const useSocketUpdates = (
  handler: (message: SocketChangeMessage) => void
) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("changes", handler);
    return () => {
      socket.off("changes", handler);
    };
  }, [socket, handler]);
};
