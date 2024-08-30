import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocketContext } from "../../Socket/SocketContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiPhoneOff } from "react-icons/fi";

const Appid = Number(process.env.REACT_APP_ZIGO_APPID);
const ServerSecret = process.env.REACT_APP_ZIGO_SECRETKEY;

function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function Video() {
  const Doctor = useSelector((state) => state.doctor.doctorData);
  const { socket } = useSocketContext();
  const [calling, setCalling] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state.data;
  const Caller = Doctor;
  const roomID = getUrlParams().get("roomID") || randomID(5);

  React.useEffect(() => {
    const initMeeting = async (element) => {
      const appID = Appid;
      const serverSecret = ServerSecret;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        randomID(5),
        randomID(5)
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              "/redirectToCall" +
              "?roomID=" +
              roomID +
              "&userId=" +
              userId,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    };

    const personalLink = `${window.location.protocol}//${window.location.host}/patient/redirectToCall?roomID=${roomID}&userId=${userId}`;
    if (calling === 0) {
      socket.emit("callingUser", { Caller, userId, personalLink });
      setCalling(1);
    }
    initMeeting(document.querySelector(".myCallContainer"));
  }, [roomID, userId]);

  useEffect(() => {
    return () => {
      window.location.reload();
    };
  }, []);

  const handleDisconnect = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div
        className="myCallContainer w-full h-4/5"
        style={{ maxHeight: "80vh" }}
      ></div>
      <button
        onClick={handleDisconnect}
        className="bg-red-500 text-white rounded-lg py-2 px-4 mt-4 flex items-center justify-center w-1/2"
      >
        <FiPhoneOff className="mr-2" />
        Disconnect
      </button>
    </div>
  );
}
