import axios, { AxiosError } from "axios";
import { apiUrl } from "../config";

export const verifyIp = async (rawUrl: string,id : string | undefined): Promise<{
  message: string;
  valid: boolean;
}> => {
  try {
    const response = await axios.get(`${apiUrl}/dns/verify-ip`, {
      params: { rawUrl, id },
      withCredentials: true,
    });
    return {
      message: response.data.message,
      valid: response.status === 200,
    };
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response?.data?.message) {
      return { message: error.response.data.message, valid: false };
    } else {
      return { message: "Failed to verify IP. Please try again later.", valid: false };
    }
  }
};