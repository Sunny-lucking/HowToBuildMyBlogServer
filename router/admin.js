
const express = require("express");
const router = express.Router();
import Admin from "./../model/admin"
const jwt = require("jsonwebtoken");
const passport = require("passport");     //引入passport中间件

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        name: req.admin.name,
    })
});
router.post("/login", async (req, res) => {
    const { name, password } = req.body;
    const admin = await Admin.findOne({ name })
    if (!admin) {
        if (name === "youke") {
            Admin.create({ name: 'youke', password: "123456" })
        }
        return res.json({
            msg: '用户不存在',
            code: -1
        })
    } else {
        if (admin.password === password) {
            const rule = { name: admin.name, _id: admin._id, };

            jwt.sign(rule, 'secret', { expiresIn: 36000 }, (err, token) => {
                if (err) {
                    throw err
                } else {
                    return res.json({
                        msg: '登陆成功',
                        blogBackToken: 'Bearer ' + token,
                        code: 0
                    })
                }
            })
            // return res.json({
            //     msg: '登陆成功',
            //     admin:{name:admin.name},
            //     code: 0
            // })
        } else {
            return res.json({
                msg: '密码错误',
                code: -1
            })
        }
    }

});

router.get('/getAdmins', async (req, res) => {
    const { pageNum, pageSize, keyWord } = req.query;
    const reg = new RegExp(keyWord, 'i')
    let adminList = await Admin.find({ name: { $regex: reg } }).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize))
    let count = await Admin.find({ name: { $regex: reg } }).estimatedDocumentCount()
    if (adminList.length > 0) {
        res.json({
            code: 0,
            msg: '获取管理员列表成功',
            adminList,
            count
        })
    } else {
        res.json({
            code: -1,
            msg: '获取管理员列表失败',
        })
    }
})
router.get('/getOneAdmin', async (req, res) => {
    const { _id } = req.query;

    let admin = await Admin.findOne({ _id })
    if (admin) {
        res.json({
            code: 0,
            msg: '获取管理员成功',
            admin,
        })
    } else {
        res.json({
            code: -1,
            msg: '获取管理员失败',
        })
    }
})
router.post('/addAdmin', async (req, res) => {
    const { name, password, email, phone } = req.body;
    let create_time = new Date().getTime()
    let admin = await Admin.create({ name, password, email, phone, create_time })

    if (admin) {
        res.json({
            msg: '创建新的管理员成功',
            code: 0,
            admin
        })
    } else {
        res.json({
            msg: '创建失败',
            code: -1,
        })
    }

})
router.post('/editOneAdmin', async (req, res) => {
    const { _id } = req.body;
    const { email, phone } = req.body;
    let { nModified } = await Admin.updateOne({ _id }, { email, phone })
    if (nModified === 1) {
        res.json({
            msg: '修改成功',
            code: 0,
        })
    } else {
        res.json({
            msg: '修改失败',
            code: -1
        })
    }

})
router.post('/changeAdminState', async (req, res) => {
    const { _id } = req.body;

    let { state } = await Admin.findOne({ _id });
    let { nModified } = await Admin.updateOne({ _id }, { state: !state })
    if (nModified === 1) {
        res.json({
            msg: '修改成功',
            code: 0,
        })
    } else {
        res.json({
            msg: "修改失败",
            code: -1
        })
    }

})
router.post('/deleteAdmin', async (req, res) => {
    const { _id } = req.body;
    let admin = await Admin.deleteOne({ "_id": _id })
    if (admin.deletedCount === 1) {
        return res.json({
            msg: '删除管理员成功',
            code: 0,
        })
    } else {
        return res.json({
            msg: '删除管理员失败',
            code: -1
        })
    }
})
router.post('/setRole', async (req, res) => {
    const { _id, roleId } = req.body;
    let admin = await Admin.updateOne({ _id }, { roleId })
    if (admin.nModified === 1) {
        return res.json({
            msg: '更改角色成功',
            code: 0,
        })
    } else {
        return res.json({
            msg: '更改角色失败',
            code: -1
        })
    }
})
module.exports = router;
