import redis from "../connection/redisClient.js";

async function cooldownVerify(id) {
  const key = `cooldownVerify${id}`;
  const cooled = await redis.get(key);
  if (cooled) {
    const count = Number(cooled);
    if (count >= 5) {
      return false;
    } else {
      await redis.incr(key);
      return true;
    }
  } else {
    await redis.set(key, 1, "EX", 43200);
    return true;
  }
}

export { cooldownVerify };
