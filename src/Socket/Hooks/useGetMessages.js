import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useConversation } from "../zustand/useConversation";
import toast from "react-hot-toast";
import axios from "axios";
import { BASE_URL } from "../../const/url";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages = [], setMessages, selectedConversation } = useConversation(); // Default messages to an empty array
  const user = useSelector((state) => state?.user?.userData);
  const doctor = useSelector((state) => state?.doctor?.doctorData);

  useEffect(() => {
    const getMessages = async () => {
      const idToSend = user?._id || doctor?._id;

      if (!idToSend) {
        toast.error("No user or doctor data available.");
        return;
      }
      if (!selectedConversation?._id) {
        toast.error("No conversation selected.");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/api/message/${selectedConversation._id}/${idToSend}`);
        const data = response.data.messages || []; 
        setMessages(data);
      } catch (error) {
        toast.error("Failed to fetch messages. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation?._id, user?._id, doctor?._id, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
