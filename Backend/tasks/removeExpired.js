import { handleDeleteDomainName } from "../controller/dns.js";
import DNS from "../model/dns.js";

const handleDeleteExpiredDomain = async () => {
  try {
    const now = new Date();
    const today = now.setHours(0, 0, 0, 0);
    const domains = await DNS.find({
      isRenewed: false,
      expiryDate: {
        $lte: today,
      },
    });
    if (domains.length === 0) return;
    for (const domain of domains) {
      try {
        const data = { dnsName: domain.dnsName, isCronJob: true };
        await handleDeleteDomainName(null, null, data);
      } catch (error) {}
    }
  } catch (error) {
    console.log("error While deleting expired domain", error);
  }
};

export default handleDeleteExpiredDomain;
