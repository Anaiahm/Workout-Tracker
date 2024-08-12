const isSignedIn = (req, res, next) => {
    if (req.url.startsWith('/stylesheets')) {
        return next();
    }
    // console.log('Checking if user is signed in');
    if (req.session.user) return next();
    res.redirect('/auth/sign-in');
};


module.exports = isSignedIn;