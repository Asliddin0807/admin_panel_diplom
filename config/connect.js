const mongoose = require("mongoose");

const connectingData = () => {
  let connect = mongoose.connect(
    "mongodb+srv://asl:w19-09@cluster0.m8yhckl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  ).then(() => {
    console.log('Data connected!')
  }).catch((err) => {
    console.log('Error', err)
  })

  return connect
};


module.exports = { connectingData }
