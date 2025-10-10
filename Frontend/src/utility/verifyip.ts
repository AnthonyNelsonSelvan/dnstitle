import axios, { AxiosError } from "axios";
import { apiUrl, recaptcha_site_key } from "../config";

export const verifyIp = async (rawUrl: string,id : string | undefined): Promise<{
  message: string;
  valid: boolean;
  status : number
}> => {
  try {
    const token = await window.grecaptcha.execute(recaptcha_site_key,{
      action : "verifyip"
    })
    const res = await axios.post(`${apiUrl}/verifyCaptcha/verify`, { token });
      if (res.data.success) {
    const response = await axios.get(`${apiUrl}/dns/verify-ip`, {
      params: { rawUrl, id },
      withCredentials: true,
    });
    return {
      message: response.data.message,
      valid: true,
      status : response.status,
    };
  }else{
    return {
      message : "Suspicious activity detected.",
      valid : false,
      status : 400
    }
  }
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response?.data?.message) {
      return { message: error.response.data.message, valid: false,status: error.response.status };
    } else {
      return { message: "Failed to verify IP. Please try again later.", valid: false,status: 500 };
    }
  }
};