import { Worker } from "bullmq";
import connection from "../connection/redis.js";
import sendEmail from "../services/email.services.js";

const emailWorker = new Worker(
  "email",
  async (job) => {
    const { to, subject, text } = job.data;
    try {
      await sendEmail(to, subject, text);
    } catch (error) {
      console.log(`Failed to send email to ${to} : ${error}`);
    }
  },
  { connection }
);

emailWorker.on('completed',(job) => {
    console.log(`job ${job.id} completed`)
})

emailWorker.on('failed', (job) => {
    console.log(`job ${job.id} failed`)
})
