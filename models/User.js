const mongoose = require("mongoose"),
    bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name field is required"],
            trim: true,
        },
        username: {
            type: String,
            required: [true, "username field is required"],
            unique: true,
            trim: true,
            validate(value) {
                let nameRegex = /^[a-zA-Z\-]+$/;
                if (!nameRegex.test(value)) {
                    throw new Error("Your username is not valid. Only characters A-Z, a-z and '-' are  acceptable.");
                } else {
                    return true
                }
            },
        },
        email: {
            type: String,
            required: [true, "email field is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if (!emailRegex.test(value)) {
                    throw new Error("Invalid email");
                } else {
                    return true
                }
            },
        },
        bitcoinAmount:{
            type: Number,
            default:0
        },
        usdBalance:{
            type: Number,
            default:0
        }
    },
    {
        timestamps: true,
    }
);

/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
