const mongoose = require("mongoose");
const workoutSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
      },
    time: {
        type: Number,
        required: true,
        min: 0,
      },
    exercises:{
        type: String,
        required: true,
      },
    caloriesBurned: {
        type: String,
        required: true,
        min: 0,
      },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
  });

  const Workout = mongoose.model("Workout", workoutSchema);
  module.exports = Workout;