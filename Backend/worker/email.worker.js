import { Worker } from "bullmq";
import connection from "../connection/redis.js";
import sendEmail from "../services/email.services.js";

const emailWorker = new Worker(
  "email",
  async (job) => {
    const { to, subject, text } = job.data;
    console.log(`📥 Received job: send email to ${to}`);
    try {
      console.log("calling sendEmail")
      await sendEmail(to, subject, text);
      console.log("sendEmail called")
      console.log(`Email sent to ${to}`);
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
