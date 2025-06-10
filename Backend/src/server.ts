import dotenv from "dotenv";
import app from "./app";
import { ensureDatabaseAndTables } from "./config/init";

dotenv.config();

const PORT = process.env.PORT || 3000;

ensureDatabaseAndTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `%c Server is running on port ${PORT} - Open in browser: %chttp://localhost:${PORT}/auth/register`,
        "color: green",
        "color: blue"
      );
    });
  })
  .catch((err) => {
    console.error("❌ Error setting up database or tables:", err);
  });
