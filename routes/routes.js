module.exports = function(app, passport) {

    //GET homepage
    app.get('/', function(req, res) {
       res.render('index', {message: req.flash('message')});
    });


    // ============= SIGN UP ===============
    // =====================================
    //POST signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard',
        failureRedirect : '/#accounts',
        failureFlash : true
    }));


    // ============= SIGN IN ===============
    // =====================================
    //POST signin form
    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect : '/dashboard',
        failureRedirect : '/#accounts',
        failureFlash : true
    }));


    // ============ LOGOUT ================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};

function isLoggedIn(req, res, next) {
    //if user is authenticated in session then carry on
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/#accounts');
}