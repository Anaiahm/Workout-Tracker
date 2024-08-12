const mongoose = require("mongoose");
const workoutSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
      },
    time: {
        type: Number,
        required: true,
        min: 1,
      },
    exercises:{
        type: [String],
        required: true,
      },
    caloriesBurned: {
        type: String,
        required: true,
        min: 1,
    },
     drankWater: {
            type: Boolean,
            required: false,
      },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
  });

  const Workout = mongoose.model("Workout", workoutSchema);
  module.exports = Workout;