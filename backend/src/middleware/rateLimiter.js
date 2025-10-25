// middleware/rateLimiter.js
import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const { success, limit, remaining, reset } = await ratelimit.limit(
      `rate-limit-${ip}`
    );

    console.log("Rate limit:", { ip, success, remaining });

    if (!success) {
      console.log("⚠️ Too many requests from:", ip);
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next(error);
  }
};

export default rateLimiter;
