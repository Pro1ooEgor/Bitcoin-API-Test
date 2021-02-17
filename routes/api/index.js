const 
    express = require("express"),
    router = express.Router();

/* GET index route */
router.get("/", function (req, res, next) {
    res.status(httpStatus.OK).json({
        status: true,
        message: MSG.SUCCESS,
        data: {
        },
    });
});

router.use("/users/", require("./users"))
router.use("/bitcoin/", require("./bitcoins"))

module.exports = router;
