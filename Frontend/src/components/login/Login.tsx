import "./index.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";
import Loader from "../overlays/Loader";
import { Toaster, toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, isLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      isLoading(true);
      const response = await axios.post(
        `${apiUrl}/user/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message || "Login failed. Please try again.";
        toast.error(msg);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      isLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://test.anthony.live/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E] p-4">
      <Toaster richColors />
      {loading && <Loader />}
      <div className="w-full max-w-md bg-[#2C2926] shadow-lg rounded-lg p-6">
        <form className="space-y-4" onSubmit={handleLogin}>
          <h1 className="text-3xl font-bold text-center text-[#E5C07B] mb-6">
            Login
          </h1>

          <label htmlFor="email" className="inputTitle">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="inputBox w-full"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="inputTitle">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="inputBox w-full"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input type="submit" value="Login" className="btn w-full" />
        </form>

        <div className="mt-4 text-center space-y-2">
          <p
            className="text-red-400 hover:underline cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          <p className="text-yellow-400 font-semibold">Other login methods</p>

          <p
            className="text-green-300 cursor-pointer hover:underline"
            onClick={handleGoogleLogin}
          >
            Authenticate with Google
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
