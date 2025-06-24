import { Queue } from "bullmq";
import connection from "../connection/redis.js";

const emailQueue = new Queue("email", { connection });

const sendEmailJob = async (to, subject, text) => {
  try {
    await emailQueue.add("send-mail", { to, subject, text });
    console.log(`Queue email to ${to}`);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
};

export default sendEmailJob;
