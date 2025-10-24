// Validate required environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "FRONTEND_URL",
  "SMTP_USER",
  "SMTP_PASS",
  "SENDER_MAIL",
];

const productionOnlyEnvVars = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

export const validateEnv = () => {
  const missing = [];

  // Check required vars
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check production-only vars
  if (process.env.NODE_ENV === "production") {
    productionOnlyEnvVars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error("\n💡 Add these to your Render environment variables");
    process.exit(1);
  }

  console.log("✅ All required environment variables are set");
};
