import { useEffect, useRef } from "react";
import useGetMessages from "../../../../Socket/Hooks/useGetMessages";
import MessageSkeleton from "../Skeletons/MessageSkeletons";
import Message from "./Message";
import useListenMessages from "../../../../Socket/Hooks/useListenMessages";
import { useConversation } from "../../../../Socket/zustand/useConversation";

function Messages() {
  const { selectedConversation } = useConversation();
  const { messages=[], loading } = useGetMessages(); // Ensure messages is always an array
  useListenMessages();
  const lastMessageRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading && messages.length > 0 ? (
        messages.map((message) => (
          <div key={message._id} ref={lastMessageRef}>
            <Message message={message} />
          </div>
        ))
      ) : loading ? (
        [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)
      ) : (
        <p>Send a message to start a conversation</p>
      )}
    </div>
  );
}

export default Messages;
