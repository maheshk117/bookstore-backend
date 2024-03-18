const express = require("express");
const app = express();
require("dotenv").config();

var cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const auth = require("./Routes/authRoutes");
const user = require("./Routes/userRoutes");
const book = require("./Routes/bookroutes");
const review = require("./Routes/reviewRoutes");
const rent = require("./Routes/rentRoutes");
app.use("/auth", auth);
app.use("/user", user);
app.use("/books", book);
app.use("/review", review);
app.use("/rent", rent);

const connstr = process.env.CONNSTR;






// app.get('/*', function(req, res) {
//     res.sendFile(path.join(__dirname ,'/build/index.html'));
//  });


const dbconn = mongoose.connect(connstr)

    .then(async () => {
        console.log("connected to db");

        app.listen(PORT, () => {
            console.log(`SERVER LISTENING ON PORT ${8000}`);
        });
    })
    .catch((error) => {
        console.log(`error! connecting${error}`);
    });
