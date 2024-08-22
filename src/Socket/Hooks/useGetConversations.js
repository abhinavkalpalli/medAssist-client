import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../const/url";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const user = useSelector((state) => state.user.userData);
  const doctor = useSelector((state) => state?.doctor?.doctorData);

  useEffect(() => {
    const getConversations = async () => {
      if (!user && !doctor) return;

      setLoading(true);

      try {
        const id = user?._id || doctor?._id;
        const action = user ? "fetchDoctorForUsers" : "fetchUsersForDoctor";
        const response = await axios.get(`${BASE_URL}/api/message/conversations`, {
          params: { id, action },
        });
        console.log(response.data);
        
        if (response.data?.conversation) {
          setConversations(response.data.conversation);
        } else {
          console.warn("No conversations found in API response");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, [user, doctor]);

  return { loading, conversations };
};


export default useGetConversations;
