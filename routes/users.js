const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel, validUser, validLogin, createToken } = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth")
const router = express.Router();
// create user
router.post("/", async (req, res) => {
  let valdiateBody = validUser(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10)
    await user.save();
    res.status(201).json(user)
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(400).json({ msg: "Email already exist in the system, try to login", code: 6 })
    }
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
});
//user login
router.post("/login", async (req, res) => {
  let validBody = validLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ msg: "Password or email is worng ,code:1" })
    }
    let authPassword = bcrypt.compare(req.body.password, user.password);
    if (!authPassword) {
      return res.status(401).json({ msg: "Password or email is worng ,code:2" });
    }
    let token = createToken(user._id, user.role);
    res.json({ token });
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
});
//get all users
router.get("/usersList", authAdmin, async (req, res) => {
  try {
    let data = await UserModel.find({}, { password: 0 });
    res.json(data)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
});
//get user info
router.get("/myInfo", auth, async (req, res) => {
  try {
    let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
    res.json(userInfo);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
});
//edit user
router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.idEdit;
    let data;
    if (req.tokenData.role == "admin") {
      data = await UserModel.updateOne({ _id: editId }, req.body);
    }
    else {
      data = await UserModel.updateOne({ _id: editId, _id: req.tokenData._id }, req.body);
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err })
  }
});
// delete user
router.delete("/:idDel", auth, async (req, res) => {
  try {
    let delId = req.params.idDel;
    let data;
    if (req.tokenData.role == "admin") {
      data = await UserModel.deleteOne({ _id: delId });
    } else {
      data = await UserModel.deleteOne({ _id: delId, _id: req.tokenData._id }, req.body);
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "There is an error, try again later", err });
  }
});

module.exports=router;
