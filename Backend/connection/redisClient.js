import Redis from "ioredis";
import connection from "./redis.js";

const redis = new Redis({
    host: connection.host,
    port: connection.port,
})

export default redis;