const express = require("express");

const { ToyModel, validToy } = require("../models/toyModel");
const { auth, authAdmin } = require("../middlewares/auth");
const { error } = require("console");
const router = express.Router();

// get all toys
router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await ToyModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
});

// search toy by name or by info
router.get("/search", async (req, res) => {
    try {
        let queryS = req.query.s;
        let searchReg = new RegExp(queryS, "i");
        let data = await ToyModel.find({
            $or: [
                { name: { $regex: searchReg } },
                { info: { $regex: searchReg } }
            ]
        })
            .limit(10);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ msg: "There is error try again later" }, err);
    }
});
//search by category
router.get("/category/:catName", async (req, res) => {
    try {
        let catName = req.params.catName;
        let searchReg = new RegExp(catName, "i");
        let data = await ToyModel.find({ category: searchReg })
            .limit(10);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ msg: "There is error try again later" }, err);
    }
});
// search by price rangr
router.get("/prices", async (req, res) => {
    let min = req.query.min || 0;
    let max = req.query.max || Infinity;
    try {
        let data = await ToyModel.find({$and:[{price:{$gte:min}},{price:{$lte:max}}]})
            .limit(10);
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ msg: "There is error try again later" }, err);
    }
});
//add a toy
router.post("/", auth, async (req, res) => {
    let valdiateBody = validToy(req.body);
    if (valdiateBody.error) {
        return res.status(400).json(valdiateBody.error.details)
    }
    try {
        let toy = new ToyModel(req.body);
        toy.userId = req.tokenData._id;
        await toy.save();
        res.status(201).json(toy)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
});
//edit a toy
router.put("/:idEdit", auth, async (req, res) => {
    let validBody = validToy(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.idEdit;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ToyModel.updateOne({ _id: editId }, req.body);
        }
        else {
            data = await ToyModel.updateOne({ _id: editId, userId: req.tokenData._id }, req.body);
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
});
// delete a toy
router.delete("/:idDel", auth, async (req, res) => {
    try {
        let delId = req.params.idDel;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ToyModel.deleteOne({ _id: delId }, req.body);
        }
        else {
            data = await ToyModel.deleteOne({ _id: delId, userId: req.tokenData._id }, req.body);
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there is an error, try again later", err })
    }
});



module.exports = router;