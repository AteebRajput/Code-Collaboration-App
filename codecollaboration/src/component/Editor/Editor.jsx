import { useEffect, useRef, useState } from "react";
import logo from "../../assets/codesync-high-resolution-logo-transparent.png";
import Members from "./Members";
import CodeEditor from "./CodeEditor";
import { initsocket } from "../../socket";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setRoomId, setCurrentUser } from "../Login/loginSlice";

function Editor() {
  const dispatch = useDispatch();
  const roomId =
    useSelector((state) => state.auth.roomId) || localStorage.getItem("roomId");
  const username =
    useSelector((state) => state.auth.currentUser?.username) ||
    JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const socketRef = useRef(null); // Reference to the socket connection
  const [members, setMembers] = useState([]); // State to track members in the room

  // Restore roomId and username from localStorage if missing
  useEffect(() => {
    if (!roomId || !username) {
      const savedRoomId = localStorage.getItem("roomId");
      const savedUsername = JSON.parse(localStorage.getItem("currentUser"));

      if (savedRoomId) dispatch(setRoomId(savedRoomId));
      if (savedUsername) dispatch(setCurrentUser(savedUsername));
    }
  }, [dispatch, roomId, username]);

  useEffect(() => {
    if (!roomId || !username) return;

    const handleError = (err) => {
      toast.error("Socket connection failed, please try again.");
      navigate("/home");
    };

    const initSocket = async () => {
      try {
        // Initialize the socket connection
        socketRef.current = await initsocket();
        socketRef.current.on("connect_error", handleError);
        socketRef.current.on("connect_failed", handleError);

        // Emit an event to join the room
        socketRef.current.emit("join", { roomId, username });

        // Update the members list when new clients join
        socketRef.current.on("updateClients", ({ clients }) => {
          setMembers(clients);
        });

        // Notify when a client disconnects
        socketRef.current.on("disconnected", ({ socketId, username }) => {
          toast.success(`${username} left the room`);
          setMembers((prev) =>
            prev.filter((client) => client.socketId !== socketId)
          );
        });
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect(); // Disconnect socket on cleanup
        socketRef.current = null;
      }
    };
  }, [roomId, username, navigate]);

  return (
    <div className="flex flex-row h-screen overflow-hidden">
      {/* Sidebar for members */}
      <div className="bg-gray-800 w-1/6 flex flex-col items-center pt-6 space-y-4 overflow-y-auto">
        <div className="p-2 rounded-md">
          <img className="h-[50px] w-[220px]" src={logo} alt="Coding Logo" />
        </div>
        <div className="w-full border-t border-gray-600 my-4"></div>
        <h1 className="text-white text-3xl">Members</h1>
        <div className="flex flex-col gap-2 w-full px-4">
          {members.map((member) => (
            <Members key={member.socketId} username={member.username} />
          ))}
        </div>
        <div className="w-full border-t border-gray-600 my-4"></div>
        <div className="py-2 flex flex-col items-center space-y-4 mb-6">
          <button
            className="text-xl w-36 h-12 rounded bg-emerald-500 text-white"
            onClick={() => navigator.clipboard.writeText(roomId)}
          >
            Copy Room ID
          </button>
          <button
            className="text-xl w-32 h-12 rounded bg-red-500 text-white"
            onClick={() => navigate("/home")}
          >
            Leave Room
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="bg-gray-700 w-5/6">
        <CodeEditor socket={socketRef.current} roomId={roomId} />
      </div>
    </div>
  );
}

export default Editor;
