const connectDB = require("./config/db");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
