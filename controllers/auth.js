const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');
const isSignedIn = require('../middleware/is-signed-in.js');

// Route to render sign-up form
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

// Route to render sign-in form
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

// Route to sign out the user
router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});


// Route to handle user sign-up
router.post('/sign-up', async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send('Username already taken.');
    }

    // Check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and Confirm Password must match');
    }

    // Hash the password before saving to the database
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // Create a new user
    await User.create(req.body);

    // Redirect to the sign-in page
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Route to handle user sign-in
router.post('/sign-in', async (req, res) => {
    console.log(req.body);
  try {
    // Get the user from the database
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send('Login failed. Please try again.');
    }

    // Check the password with bcrypt
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.send('Login failed. Please try again.');
    }

    // Create a session for the user
    req.session.user = {
      username: userInDatabase.username,
      displayName: userInDatabase.displayName,
      _id: userInDatabase._id
    };

    // Redirect to the user's page
    res.redirect("Users");
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// Route to render user-specific page
router.get('/users/:userId', isSignedIn, async (req, res) => {
    console.log('Route /users/:userId hit');
    console.log('User ID:', req.params.userId);
    console.log('Session User:', req.session.user);
    try {
        // Fetch user data from the database
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the user's page and pass the necessary data
        res.render('Users/index', { user: user, username: req.session.user.username });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
});

router.get('/users', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.render("Users/index.ejs", { users: allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

// /${userInDatabase._id}
// `/users/${userInDatabase._id}`