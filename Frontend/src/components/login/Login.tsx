import "./index.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log("Login successful!");
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

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="w-90 h-100 rounded bg-[#2C2926] shadow p-5">
          <form className="space-y-4" onSubmit={handleLogin}>
            <h1 className="mb-5 rounded font-bold text-3xl text-center font- text-[#E5C07B] p-5">
              Login
            </h1>

            <label htmlFor="username" className="inputTitle">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="inputBox"
              onChange={(e) => {
                setUsername(e.target.value);
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
        </div>
      </div>
    </div>
  );
};

export default Login;
