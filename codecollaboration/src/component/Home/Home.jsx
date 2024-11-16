import { useState } from "react";
import logo from "../../assets/codesync-high-resolution-logo-transparent.png";
import { v4 as uuidv4 } from 'uuid'; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoomId, setCurrentUser } from "../Login/loginSlice";

function Home() {
  const [roomId, setRoomIdState] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const generateRoomId = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomIdState(id);
    dispatch(setRoomId(id)); // Update Redux state with generated roomId
    toast.success("Room ID is generated");
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
        toast.error("Please enter both room ID and username");
        return;
    }
    console.log("Joining Room with ID:", roomId, "and Username:", username);
    dispatch(setRoomId(roomId));
    dispatch(setCurrentUser(username));
    navigate(`editor/${roomId}`);
    toast.success("Room is Created");
};

  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border border-white border-l-8 border-r-8 border-t-4 border-b-4 w-[500px] p-8 rounded-lg shadow-lg bg-[#1e1e1e]">
        <div className="flex justify-center py-6">
          <img className="h-[50px] w-[220px]" src={logo} alt="coding logo" />
        </div>
        <h1 className="text-white text-3xl font-semibold text-center mb-6">
          Enter the ROOM ID
        </h1>
        <form onSubmit={joinRoom} className="space-y-4">
          <div className="relative flex rounded-xl">
            <input
              required
              value={roomId}
              onChange={(e) => setRoomIdState(e.target.value)}
              className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-x-2 border-y-2 border-orange-500 focus:shadow-md py-2"
              id="roomId"
              type="text"
            />
            <label
              htmlFor="roomId"
              className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-lg peer-focus:text-[#0c0c0c] duration-150"
            >
              ROOM ID
            </label>
          </div>

          <div className="relative flex rounded-xl">
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full bg-transparent outline-none px-4 text-base rounded-xl bg-white border border-x-2 border-y-2 border-orange-500 focus:shadow-md py-2"
              id="username"
              type="text"
            />
            <label
              htmlFor="username"
              className="absolute top-1/2 translate-y-[-50%] bg-white left-4 px-2 peer-focus:top-0 peer-focus:left-3 font-light text-base peer-focus:text-lg peer-focus:text-[#121212] duration-150"
            >
              USERNAME
            </label>
          </div>
          <button
            type="submit"
            className="flex justify-center gap-2 mt-4 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-orange-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
          >
            Join
            <svg
              className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
              viewBox="0 0 16 19"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                className="fill-gray-800 group-hover:fill-gray-800"
              ></path>
            </svg>
          </button>
        </form>
        <p className="text-white flex justify-center pt-3 text-lg">
          Don't have a room Id? create
          <span className="pl-1 text-orange-500">
            <button onClick={generateRoomId} className="text-orange-500 underline">
              Room ID
            </button>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Home;
