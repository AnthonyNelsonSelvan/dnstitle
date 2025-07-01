import { Queue } from "bullmq";
import connection from "../connection/redis.js";

const bindUpdateQueue = new Queue("bind", { connection });

const sendBindJob = async (name, data) => {
  try {
    await bindUpdateQueue.add(name, data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default sendBindJob;
