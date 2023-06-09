const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");
let userSchema = new mongoose.Schema({
    fullName: {
        firstName:String,
        lastName:String
    },
    email: String,
    password: String,
    date_created: {
        type: Date, default: Date.now()
    },
    role: {
        type: String, default: "user"
    }
});
exports.UserModel = mongoose.model("users", userSchema);
exports.createToken = (user_id, user_role) => {
    let token = jwt.sign({ _id: user_id, role: user_role }, config.tokenSecret, { expiresIn: "60mins" });
    return token;
}

exports.validUser = (_reqBody) => {
    let joiSchema = Joi.object({
        fullName: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required()
          }).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(8).max(100).required(),
    });
    return joiSchema.validate(_reqBody);
}
exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
      email: Joi.string().min(2).max(99).email().required(),
      password: Joi.string().min(8).max(20).required()
    });
    return joiSchema.validate(_reqBody);
  }