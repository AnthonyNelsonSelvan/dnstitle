import DomainLimit from "./dns.limit.js";
import User from "./user.js";

async function IncWarnTimes(id) {
  const limiter = await DomainLimit.findOneAndUpdate(
    { userId: id },
    { $inc: { warnedTimes: 1 } },
    { new: true, upsert: true }
  );
  if (limiter.warnedTimes >= limiter.warnedLimit) {
    await User.findByIdAndUpdate(id, { isBanned: true });
  }
  return { result: limiter.warnedTimes <= limiter.warnedLimit, data: limiter };
}

export { IncWarnTimes };
