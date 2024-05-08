const express = require("express");
const app = express();
const { connectingData } = require("./config/connect");
const userApi = require("./routes/client_router");
const prodApi = require("./routes/product");
const adminApi = require("./routes/admin_routes");
const cors = require("cors");
const bodyParser = require('body-parser');
const { createdBot } = require("./bot/bot");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


connectingData();
createdBot()
app.use(express.json());
app.use(cors());

app.use("/", userApi);
app.use("/", prodApi);
app.use("/", adminApi);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("server is running");
});
