import { Worker } from "bullmq";
import connection from "../connection/redis.js";
import {
  addDomainBind,
  deleteDomainBind,
  updateDomainBind,
} from "../services/dns.services.js";

const bindWorker = new Worker(
  "bind",
  async (job) => {
    const { name, data } = job;

    try {
      switch (name) {
        case "add-domain":
          console.log(data);
          return await addDomainBind(data.dnsName, data.publicIp, data.recordType);

        case "delete-domain":
          return await deleteDomainBind(data.dnsName, data.recordType);

        case "update-domain":
          return await updateDomainBind(
            data.dnsName,
            data.publicIp,
            data.recordType,
            data.oldRecordType
          );

        default:
          console.log("Unknown job name:", name);
          throw new Error("Unknown job name");
      }
    } catch (error) {
      console.log("❌ bind dynamic update failed:", error);
      throw error; // rethrow so BullMQ marks job as failed
    }
  },
  { connection }
);

// Job event logs
bindWorker.on("completed", (job) => {
  console.log(`✅ job ${job.id} (${job.name}) completed`);
});

bindWorker.on("failed", (job, err) => {
  console.log(`❌ job ${job.id} (${job.name}) failed:`, err.message);
});
