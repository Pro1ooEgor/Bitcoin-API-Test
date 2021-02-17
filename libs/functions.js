module.exports.apiErrorResponse = async function (req, res, err, type) {
    //console.log('err',err, 'type', type)
    let status = httpStatus.BAD_REQUEST;
    let messag = MSG.SOMETHING_WRONG;

    if (err && err.name && (err.name == "ValidationError" || "MongoError"))
        type = "validation";

    switch (type) {
        case "server":
            status = httpStatus.INTERNAL_SERVER_ERROR;
            messag = MSG.SERVER_ERROR;
            break;
        case "unauthorized":
            status = httpStatus.UNAUTHORIZED;
            messag = MSG.UNAUTHORIZED;
            break;
        case "validation":
            status = httpStatus.UNPROCESSABLE_ENTITY;
            messag = err.message ? err.message : MSG.VALIDATION_FAILED;
            break;
        default:
            break;
    }
    res.status(status).json({
        status: false,
        message: messag,
        data: err,
    });
};

module.exports.userBalance = async function (user){
    const Bitcoin = require("../models/Bitcoin")
    let bitcoin = await Bitcoin.findOne({}).select('price updatedAt')
    if(!bitcoin){
        bitcoin = new Bitcoin({price:100})
        await bitcoin.save();
    }
    return user.usdBalance + user.bitcoinAmount*bitcoin.price
}

