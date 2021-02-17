const mongoose = require("mongoose");

const bitcoinSchema = mongoose.Schema(
    {
        price:{
            type: Number,
            default:100
        }
    },
    {
        timestamps: true,
    }
);

/**
 * @typedef Bitcoin
 */
const Bitcoin = mongoose.model("Bitcoin", bitcoinSchema);

module.exports = Bitcoin;
