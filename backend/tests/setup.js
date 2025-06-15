const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");

require("dotenv").config({ path: dotenvPath });

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}
