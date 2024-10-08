const dotenv = require("dotenv"); 
dotenv.config(); 
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const port = process.env.PORT ? process.env.PORT : '3000';
const app = express();
app.set('views', path.join(__dirname, 'views'));

// Set the view engine (e.g., EJS)
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Workout = require("./models/workout.js");

const authController = require('./controllers/auth.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const workoutsController = require('./controllers/workouts.js');
// const userRoutes = require('./models/user.js');




app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(passUserToView);
app.use(methodOverride("_method"));

app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
});
app.use('/auth', authController);
app.use(isSignedIn);
app.get("/users", (req, res) => {
    console.log(req.session.user);
    res.render("Users/index.ejs", { username: req.session.user ? req.session.user.username : 'Guest' });;
});

app.get("/workouts", async (req, res) => {
    const allWorkouts = await Workout.find();
    console.log(allWorkouts);
    res.render("workouts/index.ejs", { workouts: allWorkouts });
});

app.get("/workouts/new", (req, res) => {
    res.render("workouts/new.ejs");
});

app.get("/workouts/:workoutId", async (req, res) => {
    const foundWorkout = await Workout.findById(req.params.workoutId);
    res.render("workouts/show.ejs", { workout: foundWorkout });
});

app.post("/workouts", async (req, res) => {
    if (req.body.drankWater === "on") {
        req.body.drankWater = true;
    } else {
        req.body.drankWater = false;
    }
    req.body.owner = req.session.user._id;
    await Workout.create(req.body);
    res.redirect("/workouts");    
});

app.delete("/workouts/:workoutId", async (req, res) => {
    await Workout.findByIdAndDelete(req.params.workoutId);
    res.redirect("/workouts");
});

app.get("/workouts/:workoutId/edit", async (req, res) => {
    try {
        const foundWorkout = await Workout.findById(req.params.workoutId);
        const exercises = [
            'Push-ups',
            'Pull-ups',
            'Running',
            'Cycling',
            'Swimming',
            'Yoga',
            'BJJ',
            'Basketball',
            'Cheerleading'
        ]; 
        const selectedExercises = foundWorkout.exercises || []; 
        res.render("workouts/edit.ejs", { 
            workout: foundWorkout,
            exercises: exercises,
            selectedExercises: selectedExercises
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.put("/workouts/:workoutId", async (req, res) => {
    if (req.body.drankWater === "on") {
        req.body.drankWater = true;
    } else {
        req.body.drankWater = false;
    }

    await Workout.findByIdAndUpdate(req.params.workoutId, req.body);
    res.redirect(`/workouts/${req.params.workoutId}`);
});

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
