import { FC, PropsWithChildren, useEffect, useState, useMemo } from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "./socket.context";
import { createSocket } from "./socket";
import { useAppSelector } from "@/app/store/store";

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPing, setLastPing] = useState<number | null>(null);
  
  const isAuth = useAppSelector((state) => !!state.auth.user);

  useEffect(() => {
    let socketInstance: Socket | null = null;

    if (isAuth) {
      socketInstance = createSocket();
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });

      socketInstance.on("pong", (latency) => {
        setLastPing(latency);
      });

      // Периодическая проверка состояния
      const healthCheck = setInterval(() => {
        if (socketInstance?.connected) {
          const start = Date.now();
          socketInstance.emit("ping", () => {
            const duration = Date.now() - start;
            setLastPing(duration);
          });
        }
      }, 30000);

      return () => {
        clearInterval(healthCheck);
        socketInstance?.disconnect();
        setSocket(null);
      };
    }
  }, [isAuth]);

  // Индикатор состояния соединения
  useEffect(() => {
    if (lastPing !== null && lastPing > 1000) {
      console.warn("High latency detected:", lastPing, "ms");
    }
  }, [lastPing]);

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      lastPing,
    }),
    [socket, isConnected, lastPing]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
