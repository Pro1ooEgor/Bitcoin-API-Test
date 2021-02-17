const 
    express = require("express"),
    router = express.Router(),
    Bitcoin = require("../../models/Bitcoin");

/**
 * retrieves the current bitcoin object
*/
router.get("/", async function (req, res, next) {
    try {
        let bitcoin = await Bitcoin.findOne({}).select('price updatedAt')
        if(!bitcoin){
            bitcoin = new Bitcoin({price:100})
            await bitcoin.save();
        }

        res.status(httpStatus.OK).json({
            status: true,
            message: MSG.FETCH_SUCCESS,
            data: {
                price:bitcoin.price,
                updatedAt:bitcoin.updatedAt
            },
        });
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});

/**
 * updates the bitcoin price
*/
router.put("/", async function (req, res, next) {
    try {
        if(!req.body.price){
            req.body.price = 100
        }
        
        let bitcoin = await Bitcoin.findOneAndUpdate(
            {},
            {price:req.body.price},
            {new:true,upsert:true}
        ).select('price updatedAt')
       

        res.status(httpStatus.OK).json({
            status: true,
            message: MSG.UPDATE_SUCCESS,
            data: {
                price:bitcoin.price,
                updatedAt:bitcoin.updatedAt
            },
        });
    } catch (error) {
        return FUNC.apiErrorResponse(req, res, error);
    }
});


module.exports = router;
