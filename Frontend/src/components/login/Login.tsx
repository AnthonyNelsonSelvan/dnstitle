import "./index.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/user/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate("/")
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://test.anthony.live/api/auth/google"
  }

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="w-110 h-135 rounded bg-[#2C2926] shadow p-5">
          <form className="space-y-4" onSubmit={handleLogin}>
            <h1 className="mb-5 rounded font-bold text-3xl text-center font- text-[#E5C07B] p-5">
              Login
            </h1>

            <label htmlFor="email" className="inputTitle">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="inputBox"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <label htmlFor="password" className="inputTitle">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="inputBox"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <input type="submit" value={"submit"} className="btn" />
            {error && <p className=" text-red-700 text-center">{error}</p>}
          </form>
          <p className="text-red-500 text-center cursor-pointer" onClick={() => navigate("/forgot-password")}>forgot password</p>
          <p className="text-yellow-500 text-center">other methods</p>
          <p className="text-green-300 text-center cursor-pointer" onClick={handleGoogleLogin}>Authenticate with google</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
