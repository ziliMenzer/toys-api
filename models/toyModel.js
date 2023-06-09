const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
let toySchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    date_created: {
        type: Date, default: Date.now()
    },
    userId: String
});
exports.ToyModel = mongoose.model("toys", toySchema);

exports.validToy = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(2).max(500).required(),
        category: Joi.string().min(2).max(150).required(),
        img_url: Joi.string().min(0).max(3000).allow(null, ""),
        price: Joi.number().min(0).max(1000).required()
    });
    return joiSchema.validate(_reqBody);
}