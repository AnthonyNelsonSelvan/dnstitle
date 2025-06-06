import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config";
import { AxiosError } from "axios";
import checkPasswordStrength from "../../utility/checkPasswordStrength";

interface SuccessResponse {
  message: string;
}

interface ErrorResponse {
  message: string;
}

const SignUp = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cpassword, setCpassword] = useState<string>("");
  const [serror, setSerror] = useState<string>("");
  const [passStrength,setPassStrength] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [valid,setValid] = useState<boolean>(false)
  const navigate = useNavigate();

  useEffect(() => {
  const passwordStrength = () => {
    const response = checkPasswordStrength(password)
    if(password.length === 0) return setValid(false);
    if(3 >= response.score){
      setPassStrength("Try Some Stronger Password.")
      setValid(false)
      return
    }
    setPassStrength("")
    setValid(true)
  }
  passwordStrength()
},[password])

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const response = await axios.post<SuccessResponse>(
        `${apiUrl}/user/signup`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
  
      console.log("Response:", response.data.message);
      if (response.status === 200) {
        console.log("Navigating to login");
        navigate("/login");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      console.log("Axios Error:", axiosError);
  
      if (axiosError.response?.data?.message) {
        setSerror(axiosError.response.data.message);
      } else {
        setSerror("Something went wrong. Please try again.");
      }
    }
  };
  

  const checkPassword = () => {
    if (password !== cpassword) {
      setError(true);
    } else {
      setError(false);
    }
  };
  return (
    <div>
      {serror && <p className="top-0 bg-amber-50 text-center">{serror}</p>}
      <div className="flex justify-center items-center h-screen">
        <div className="w-110 h-142 rounded bg-[#2C2926] shadow p-6">
          <form className="space-y-4" onSubmit={handleSignUp}>
            <h1 className="mb-5 rounded font-bold text-3xl text-center font- text-[#E5C07B] p-5">
              Sign-Up
            </h1>

            <label htmlFor="email" className="inputTitle">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="inputBox"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <label htmlFor="password" className="inputTitle">
              Set Password
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
            {passStrength && <p className="text-red-500">{passStrength}</p>}
            <label htmlFor="cpassword" className="inputTitle">
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              className="inputBox"
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
              onKeyUp={checkPassword}
              required
            />
            {error && <p className="text-center">password does not match</p>}
            <input type="submit" value={"Sign Up"} className="btn" disabled={!valid && error}/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
