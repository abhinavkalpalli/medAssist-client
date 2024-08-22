import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { BiPhoneCall, BiPhoneOff } from "react-icons/bi";
import Callreject from "../components/Patient/Callreject"
const Serverhost=process.env.REACT_APP_SERVERHOST
const SocketContext = createContext();
export const useSocketContext = () => {
  return useContext(SocketContext);
};
export const SocketContextProvider = ({ children }) => {
  const User = useSelector((state) => state.user.userData);
  const Doctor = useSelector((state) => state.doctor.doctorData);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({})
 
  const userId = User?._id || Doctor?._id;
  useEffect(() => {
    if (userId) {
      const newSocket = io(Serverhost, { query: { userId } });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      newSocket.on("typing", (user) => {
        setTypingUsers((prevTypingUsers) => {
          if (!prevTypingUsers.some((u) => u._id === user._id)) {
            return [...prevTypingUsers, user];
          }
          return prevTypingUsers;
        });
      });
      newSocket.on("stopTyping", (user) => {
        setTypingUsers((prevTypingUsers) => {
          return prevTypingUsers.filter((u) => u._id !== user._id);
        });
      });
      newSocket.on("newunreadMessage", ({ from, unreadCount }) => {
        setUnreadMessages((prevUnreadMessages) => ({
          ...prevUnreadMessages,
          [from]: unreadCount,
        }));
      });
      newSocket.on("callRejected", () => {
        toast(
          (t) => (
            <div className="p-4 bg-red-300 rounded-sm shadow-md">
              <BiPhoneOff className="h-5 w-5 text-red-500" />
              <p className="mb-2 text-md font-semibold text-gray-800">
                CALL DECLINED
              </p>
            </div>
          ),
          { duration: 4000 }
        );
      });
      newSocket.on("incomingCall", ({ Caller, personalLink }) => {
        toast(
          (t) => (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <BiPhoneCall className="h-8 w-8 text-green-500" />
              <p className="mb-2 text-lg font-semibold text-gray-800">
                Incoming Call from {Caller.name}
              </p>
              <div className="flex justify-between">
                <button className="px-4 py-2 mr-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700">
                  <a href={personalLink}>Join Now</a>
                </button>
                <Callreject t={t.id} Caller={Caller} />
              </div>
            </div>
          ),
          { duration: 10000 }
        );
      });
      return () => {
        newSocket.close();
        setSocket(null);
      };
    } else if (socket) {
      socket.close();
      setSocket(null);
    }
  }, [userId]);
  const startTyping = useCallback(() => {
    if (socket) {
      socket.emit("typing");
    }
  }, [socket]);
  const stopTyping = useCallback(() => {
    if (socket) {
      socket.emit("stopTyping");
    }
  }, [socket]);
  const sendnewMessage = useCallback(
    (to, from) => {
      if (socket) {
        socket.emit("sendnewMessage", { to, from });
      }
    },
    [socket]
  );
  const markAsRead = useCallback(
    (to, from) => {
      if (socket) {
        socket.emit("markAsRead", { from, to });
        setUnreadMessages((prevUnreadMessages) => {
          const newUnreadMessages = { ...prevUnreadMessages };
          delete newUnreadMessages[from];
          return newUnreadMessages;
        });
      }
    },
    [socket]
  );
  const Videocall = useCallback(
    (userId, link) => {
      if (socket) {
        socket.emit("callingUser", { userId, link });
      }
    },
    [socket]
  );
  const onCallRejected = useCallback(
    (Caller) => {
      if (socket) {
        socket.emit("onRejected", { Caller });
      }
    },
    [socket]
  );
  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typingUsers,
        unreadMessages,
        startTyping,
        stopTyping,
        sendnewMessage,
        markAsRead,
        Videocall,
        onCallRejected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
