import mongoose from "mongoose";
const connectToDB = async () => {
  const url = process.env.MONGODB_URL;
  try {
    const { connection } = await mongoose.connect(url);
    if (connection) {
      console.log(`Connected to Database ${connection.host} `);
    }
  } catch (err) {
    console.log("Error connecting to Database", err);
  }
};
export default connectToDB;
