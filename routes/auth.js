const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

const router = new Router();

// POST /login - login: {username, password} => {token}
router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token});
        } else {
            throw new ExpressError("Invalid request", 400);
        }
    } catch(err) {
        return next(err);
    }
});


// POST /register - register user: registers, logs in, and returns token.
router.post("/register", async function(req, res, next) {
    try {
        let user = await User.register(req.body);
        User.updateLoginTimestamp(user.username);
        let token = jwt.sign({ username: user.username }, SECRET_KEY);
        return res.json({ token });
    } catch(err) {
        return next(err);
    }
})

module.exports = router;
