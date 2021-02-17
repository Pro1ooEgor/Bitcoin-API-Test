const express = require("express"),
    router = express.Router(), 
    User = require("../../models/User");

/*
user sign up
*/
router.post("/",async function (req, res, next) {
    try {
        if (!req.body.name || !req.body.username || !req.body.email) {
            return FUNC.apiErrorResponse(
                req,
                res,
                { message: MSG.REQUIRED_FIELDS_MISSING },
                "validation"
            );
        }
        let exists = await User.findOne({
            $or : [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });
        if (exists)
            return FUNC.apiErrorResponse(
                req,
                res,
                { message: MSG.ALREADY_REGISTERED },
                "validation"
            );

        let user = new User(req.body)
        user.save(async function (error, result) {
            if (error) {
                return FUNC.apiErrorResponse(req, res, error);
            } else {
                res.status(httpStatus.OK).json({
                    status: true,
                    message: MSG.REGISTER_SUCCESS,
                    data: result,
                });
            }
        });
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});

/*
retrieves a user object
*/
router.get("/:id", async function (req, res, next) {
    try {
        let user = await User.findOne({_id:req.params.id})
        
        res.status(httpStatus.OK).json({
            status: true,
            message: MSG.FETCH_SUCCESS,
            data: user,
        });
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});

/*
allows a user to change the name or the email
*/
router.put("/:id", async function (req, res, next) {
    try {
        let user = await User.findOneAndUpdate(
            {_id:req.params.id},
            {name:req.body.name,email:req.body.email},
            {new:true}
        )

        res.status(httpStatus.OK).json({
            status: true,
            message: MSG.UPDATE_SUCCESS,
            data: user,
        });
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});

/*
retrieves the total balance of the user in usd
*/
router.get("/:id/balance", async function (req, res, next) {
    try {
        let user = await User.findOne(
            {_id:req.params.id}
        )
        if(!user){
            return FUNC.apiErrorResponse(
                req,
                res,
                { message: MSG.NOT_FOUND },
                "validation"
            );
        }

        let balance = await FUNC.userBalance(user)

        res.status(httpStatus.OK).json({
            status: true,
            message: MSG.FETCH_SUCCESS,
            data: balance,
        });
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});

/*
allows a user to deposit or withdraw us dollars
*/
router.post("/:id/usd", async function (req, res, next) {
    try {
        let user = await User.findOne(
            {_id:req.params.id}
        )
        if(!user){
            return FUNC.apiErrorResponse(
                req,
                res,
                { message: MSG.NOT_FOUND },
                "validation"
            );
        }

        switch (req.body.action) {
            case 'withdraw':

                //insufficient funds check
                if(parseFloat(req.body.amount) > parseFloat(user.usdBalance)){
                    return FUNC.apiErrorResponse(
                        req,
                        res,
                        { message: MSG.INSUFFECIENT_BALANCE },
                        "validation"
                    );
                }

                let userW = await User.findOneAndUpdate(
                    {_id:req.params.id},
                    {usdBalance:user.usdBalance - parseFloat(req.body.amount) },
                    {new:true}
                )
                return res.status(httpStatus.OK).json({
                    status: true,
                    message: MSG.SUCCESS,
                    data: userW,
                });

            case 'deposite':

                let userD = await User.findOneAndUpdate(
                    {_id:req.params.id},
                    {usdBalance:user.usdBalance + parseFloat(req.body.amount) },
                    {new:true}
                )
                return res.status(httpStatus.OK).json({
                    status: true,
                    message: MSG.SUCCESS,
                    data: userD,
                });

            default:
                return FUNC.apiErrorResponse(
                    req,
                    res,
                    { message: MSG.INVALID_USD_ACTION },
                    "validation"
                );
        }
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});

/*
allows a user to buy or sell bitcoins
*/
router.post("/:id/bitcoins", async function (req, res, next) {
    try {
        let user = await User.findOne(
            {_id:req.params.id}
        )
        if(!user){
            return FUNC.apiErrorResponse(
                req,
                res,
                { message: MSG.NOT_FOUND },
                "validation"
            );
        }

        switch (req.body.action) {
            case 'sell':

                //insufficient funds check
                if(parseFloat(req.body.amount) > parseFloat(user.bitcoinAmount)){
                    return FUNC.apiErrorResponse(
                        req,
                        res,
                        { message: MSG.INSUFFECIENT_BALANCE },
                        "validation"
                    );
                }

                let userW = await User.findOneAndUpdate(
                    {_id:req.params.id},
                    {bitcoinAmount:user.bitcoinAmount - parseFloat(req.body.amount) },
                    {new:true}
                )
                return res.status(httpStatus.OK).json({
                    status: true,
                    message: MSG.SUCCESS,
                    data: userW,
                });

            case 'buy':

                let userD = await User.findOneAndUpdate(
                    {_id:req.params.id},
                    {bitcoinAmount:user.bitcoinAmount + parseFloat(req.body.amount) },
                    {new:true}
                )
                return res.status(httpStatus.OK).json({
                    status: true,
                    message: MSG.SUCCESS,
                    data: userD,
                });

            default:
                return FUNC.apiErrorResponse(
                    req,
                    res,
                    { message: MSG.INVALID_BITCOIN_ACTION },
                    "validation"
                );
        }
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});

module.exports = router;
