import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation.js";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessages", (newMessage) => {
      console.log(newMessage);
      newMessage.shouldShake = true;
      setMessages([...messages, newMessage]);
    });

    return () => {
      socket.off("newMessages");
    };
  }, [messages, setMessages, socket]);
};

export default useListenMessages;
