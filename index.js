//Import all the libraries.
const http = require("http");
const path = require("path");
const fs = require ("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./api/API");
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", router);

//Using mongoose to connect to our Mongo-DB database.
mongoose.connect(
   process.env.MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true}, 
    () => console.log("Connected to db")
);

//Here we create an server-object.
//The only thing this server does right now is to send a response back to the client.
//We use the end response method to tell the server to end the response (to stop send response to client).
/*
const server = http.createServer((request, response) => 
{
    response.write("Hello from my first Web-server!");
    response.end();
});
*/

const PORT = process.env.PORT;

//We expose our server by using the listen method.
//Inside the listen method we set up a Port so that we can communicate with our client (In this case our browser).
app.listen(PORT, () => console.log("Server is up and running!"));

