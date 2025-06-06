import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChangePassword from "./ChangePassword";

const ResetPassword = () => {
  const [verified, setVerified] = useState<boolean>(false);
  const { token } = useParams();
  console.log(token)
  useEffect(() => {
    const handleVerifyToken = async () => {
      try {
        const response = await axios.get(
          `http://test.anthony.live/api/password/verify-token/${token}`
        );
        if(response.status !== 200){
          return setVerified(false)
        }
          return setVerified(true);
      } catch (error) {
        setVerified(false);
        console.log(error);
      }
    };
    handleVerifyToken();
  }, [token]);
  return <div>{verified ? <ChangePassword token={token}/> : "not verified"}</div>;
};

export default ResetPassword;
