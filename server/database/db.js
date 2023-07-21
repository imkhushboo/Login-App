const mongoose = require('mongoose');
const { MongoMemoryServer } = require("mongodb-memory-server");

async function connectToMongodb() {
    try {
        mongoServer = await MongoMemoryServer.create();
        // const uri = mongoServer.getUri();
        const uri = "mongodb+srv://imkhushboo:Tiaragill_14@cluster0.he2ykfn.mongodb.net/test";
        console.log(uri);
        const db = await mongoose.connect(uri);
        console.log("connected to mongodb");
        return db;
    }
    catch (err) {
        console.log(err);
    }

}

module.exports = connectToMongodb;