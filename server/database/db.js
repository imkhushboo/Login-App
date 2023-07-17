const mongoose = require('mongoose');
const { MongoMemoryServer } = require("mongodb-memory-server");

async function connectToMongodb() {
    mongoServer = await MongoMemoryServer.create();
    // const uri = mongoServer.getUri();
    const uri = "mongodb://127.0.0.1:27017/login_app";
    // console.log(uri);
    const db = await mongoose.connect(uri);
    console.log("connected to mongodb");
    return db;
}

module.exports = connectToMongodb;