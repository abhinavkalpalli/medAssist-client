import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocketContext } from "../SocketContext";
import { useConversation } from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../const/url";


const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { sendnewMessage } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();
  const user = useSelector((state) => state.user.userData);
  const doctor = useSelector((state) => state.doctor.doctorData);
  const sendMessage = async (messageContent) => {
    setLoading(true);
    try {
      let idToSend = user
        ? user._id
        : doctor
        ? doctor._id
        : null;
      if (!idToSend) throw new Error("User ID not found");
      sendnewMessage(selectedConversation?._id, idToSend);
      const formData = new FormData();
      if (typeof messageContent === "string") {
        formData.append("message", messageContent);
      } else if (messageContent instanceof File) {
        formData.append("image", messageContent);
      } else if (messageContent instanceof Blob) {
        formData.append("voiceMessage", messageContent, "voiceMessage.webm");
      }
      const response = await axios.post(
        `${BASE_URL}/api/message/send/${selectedConversation._id}/${idToSend}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );
      const data = response.data.newMessage;
      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading };
};
export default useSendMessage;
