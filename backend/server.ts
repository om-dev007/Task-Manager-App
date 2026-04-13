import app from "./src/app";
import { config } from "./src/config/config";

const port = config.port || 8080;
import { connectDb } from "./src/config/db";

connectDb();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});