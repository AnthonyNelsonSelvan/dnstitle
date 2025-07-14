import redis from "../connection/redisClient.js";

function midNightTtl() {
  const now = new Date();
  const reset = new Date();
  reset.setUTCHours(24, 0, 0, 0);
  const ttl = Math.floor((reset.getTime() - now.getTime()) / 1000);
  return ttl;
}

async function handleAbuseIpdbLimitHit() {
    const ttl = midNightTtl();
    await redis.set("abuseIpdb:rate_limited","true","EX",ttl)
}

export default handleAbuseIpdbLimitHit;


