import mongoose from "mongoose";

mongoose.connect(process.env.DB_CONNECTION_STRING);

const db = mongoose.connection;

export default db;