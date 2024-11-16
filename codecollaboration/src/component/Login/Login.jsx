import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from "../../config";
import { signInWithPopup } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { setLoggedIn, setCurrentUser } from "./loginSlice";


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await signInWithPopup(auth, provider);
      
      if (!userData.user.emailVerified) {
        setError("Please verify your email address before logging in.");
        return;
      }

      dispatch(setLoggedIn(true));
      dispatch(setCurrentUser({
        id: userData.user.uid,
        username: userData.user.displayName,
        profilePic: userData.user.photoURL,
      }));

      // Redirect to dashboard or home page after successful login
      navigate('/home');
      
    } catch (error) {
      setError(error.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className={`flex items-center gap-4 max-w-[400px] px-8 py-4 text-xl font-bold text-white uppercase 
          bg-[rgb(50,50,80)] border border-[rgba(50,50,80,0.25)] rounded-lg 
          transition-transform duration-600 ease-in-out 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:bg-[rgb(90,90,120)] hover:shadow-md'} 
          focus:outline-none focus:ring-4 focus:ring-[rgba(0,0,40,0.3)] 
          active:scale-95 active:opacity-80`}
      >
        {isLoading ? (
          <span className="inline-block animate-spin mr-2">⌛</span>
        ) : (
          <svg className="w-8 h-8 fill-current" viewBox="0 0 256 262">
    <path
      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      fill="#4285F4"
    ></path>
    <path
      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      fill="#34A853"
    ></path>
    <path
      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      fill="#FBBC05"
    ></path>
    <path
      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      fill="#EB4335"
    ></path>
  

          </svg>
        )}
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </button>
    </div>
  );
}