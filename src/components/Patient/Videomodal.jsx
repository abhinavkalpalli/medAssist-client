import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPhoneOff } from 'react-icons/fi';

const Appid = Number(process.env.REACT_APP_ZIGO_APPID)
const ServerSecret =process.env.REACT_APP_ZIGO_SECRETKEY

function randomID(len) {
  let result = '';
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = getUrlParams();
  const roomID = params.get('roomID') || randomID(5);
  const userId = params.get('userId');
  const User = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!User || User._id !== userId) {
      navigate('/');
      return;
    }

    const initMeeting = async () => {
      const appID = Appid;
      const serverSecret = ServerSecret;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: document.querySelector('.myCallContainer'),
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        config: {
          showJoinView: false, 
          showPreJoinView: false,
          showSettings: false, 
        },
        showPreJoinView:false,
        onUserJoin: (user) => {
          console.log(`${user.userID} joined the room`);
        },
        onUserLeave: (user) => {
          console.log(`${user.userID} left the room`);
        }
      });
    };

    initMeeting();

    return () => {
      window.location.reload();
    };
  }, [roomID, userId, navigate, User]);

  const handleDisconnect = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div
        className="myCallContainer w-full h-[80vh]"
        style={{ maxHeight: '80vh' }}
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
