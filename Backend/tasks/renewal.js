import DNS from "../model/dns.js";

const handleSendRenewalAlert = async () => {
  try {
    const today = new Date();
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(in7Days.setHours(23, 59, 59, 999));
    const result = await DNS.updateMany(
      {
        isRenewed: true,
        expiryDate: { $gte: start, $lte: end },
      },
      {
        $set: { isRenewed: false },
      }
    );
    console.log(`${result.modifiedCount} domains marked as not renewed.`);
  } catch (error) {
    console.log("cron Renewal alert error ", error);
  }
};

export default handleSendRenewalAlert;