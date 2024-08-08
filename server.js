const dotenv = require("dotenv"); 
dotenv.config(); 
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const app = express();

app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

  
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Workout = require("./models/workout.js");

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js');
const workoutsController = require('./controllers/workouts');

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

app.use('/auth', authController);
app.use('/workouts', isSignedIn, workoutsController);
app.use(passUserToView);

app.get('/', (req, res) => {
    res.render('index.ejs', {
      user: req.session.user,
    });
  });

  app.get("/workouts/new", (req, res) => {
    res.render("workouts/new.ejs");
  });


app.listen(3000, () => {
  console.log("Listening on port 3000");
});
