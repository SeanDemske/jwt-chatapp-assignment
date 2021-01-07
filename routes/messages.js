const Router = require("express").Router
const Messages = require("../models/message");
const {ensureCorrectUser, ensureLoggedIn} = require("../middleware/auth");

const router = new Router();

// GET /:id - get detail of message.
router.get("/:id", ensureCorrectUser, async function(req, res, next) {
    try {
        let message = await Messages.get(req.params.id);
        return res.json({ message });
    } catch(err) {
        return next(err);
    }
});


// POST / - post message.
router.post("/", ensureLoggedIn, async function(req, res, next) {
    try {
        const properties = {
            from_username: req.user.username, 
            to_username: req.body.to_username, 
            body: req.body.body
        }

        let message = await Messages.create(properties);

        return res.json({ message });
    } catch(err) {
        return next(err);
    }
});

// POST/:id/read - mark message as read:
router.post("/:id/read", ensureLoggedIn, async function(req, res, next) {
    try {
        let message = await Messages.get(req.params.id);
        if (message.to_username !== req.user.username) {
            throw new ExpressError("Unauthorized", 400);
        };

        let readMessage = Messages.markRead(req.paraams.id);

        return res.json({ message: readMessage });
    } catch(err) {
        return next(err);
    }
});
