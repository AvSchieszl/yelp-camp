const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.createNewUser = async (req, res) => {
    try {
        const { email, username, password } = req.body.user;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err)
            } else {
                req.flash('success', 'Welcome to YelpCamp!');
                res.redirect('/campgrounds');
            }
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
};

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
};