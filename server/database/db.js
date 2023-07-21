const mongoose = require('mongoose');
const { MongoMemoryServer } = require("mongodb-memory-server");

async function connectToMongodb() {
    try {
        mongoServer = await MongoMemoryServer.create();
        // const uri = mongoServer.getUri();
        const uri = "mongodb://127.0.0.1:27017/login_app";
        console.log(uri);
        const db = await mongoose.connect(uri);
        console.log("connected to mongodb");
        return db;
    }
    catch (err) {
        console.log("error occured while connecting to mongodb!!");
    }

}

module.exports = connectToMongodb;