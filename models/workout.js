const mongoose = require("mongoose");
const workoutSchema = new mongoose.Schema({
    date: String,
    time: Number,
    exercises:String,
    caloriesBurned: String,
  });

  const Workout = mongoose.model("Workout", workoutSchema);
  module.exports = Fruit;