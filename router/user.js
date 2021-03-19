import User from "../model/users";
import Article from "../model/article";
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const axios = require("axios")
const passport = require("passport");     //引入passport中间件
const GITHUB_INFO = {
    clientID: "d1d8edec3f85e60918f9",
    clientSecret: "7fb7a7a78755164d0d677f65bfca7cbf212dbb80"
}
router.get('/getCount', async (req, res) => {
    let count = await User.find({}).estimatedDocumentCount()

    return res.json({
        msg: '获取用户数成功',
        code: 0,
        count
    })
})
router.post("/getToken", async (req, res) => {
    try {
        const { code } = req.body;
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token?' +
                `client_id=${GITHUB_INFO.clientID}&` +
                `client_secret=${GITHUB_INFO.clientSecret}&` +
                `code=${code}`,
            headers: {
                accept: 'application/json'
            }
        });
        const result = await axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                accept: 'application/json',
                Authorization: `token ${tokenResponse.data.access_token}`
            }
        });
        let user = await User.findOne({ '_id': result.data.id });
        if (user) {

            await User.updateOne({ _id: result.data.id }, { git_name: result.data.name, avatar_url: result.data.avatar_url, bio: result.data.bio, company: result.data.company, location: result.data.location }, function (err, doc) {
                if (err) console.log(err);
            })
        } else {
            await User.create({ git_name: result.data.name, _id: result.data.id, avatar_url: result.data.avatar_url, bio: result.data.bio, company: result.data.company, location: result.data.location ,createTime:new Date()})
        }
        const rule = { git_name: result.data.name, _id: result.data.id, avatar_url: result.data.avatar_url };

        jwt.sign(rule, 'secret', { expiresIn: 36000 }, (err, token) => {
            if (err) {
                throw err
            } else {
                return res.json({
                    msg: '登陆成功',
                    blogFrontToken: 'Bearer ' + token,
                    code: 0
                })
            }
        })
    } catch (e) {
        res.json({
            errorMessage: e
        })
    }
});

router.post('/login', passport.authenticate("jwt", { session: false }), async (req, res) => {
    return res.json({
        code: 0,
        user: req.user
    })
})
router.post('/delete', async (req, res) => {
    const { _id } = req.body
    try {
        let user = await User.deleteOne({ _id });
        if (user) {
            return res.json({
                msg: '删除成功',
                code: 0
            })
        } else {
            return res.json({
                code: -1,
                msg: '删除失败'
            })
        }
    } catch (e) {
        res.json({
            msg: e.message || e,
            code: -1
        })
    }
})
router.post('/getAuthor', async (req, res) => {
    try {
        const { _id } = req.body;
        let user = await User.findOne({ _id })
        // 获取用户的文章点赞数和阅读数
        // let articleList = await Article.find({ user_id: _id })
        // let praiseCount = 0
        // let pvCount = 0
        // 当是搜索某个用户的文章的时候，需要返回文章的点赞总数和阅读总数
        // articleList.map((item, index) => {
        //     praiseCount += item.praiseList.length
        //     pvCount += item.pvcount
        // })
        // user.praiseCount = praiseCount
        // user.pvCount = pvCount
        if (user) {
            res.json({
                code: 0,
                msg: '获取用户信息成功',
                user,
            })
        } else {
            res.json({
                code: -1,
                msg: '获取用户信息失败',
            })
        }
    } catch (e) {
        res.json({
            msg: e.message || e,
            code: -1
        })
    }
})
router.post('/getAllAuthor', async (req, res) => {
    try {
        const { pageNum, pageSize, keyWord } = req.body;
        const reg = new RegExp(keyWord, 'i')
        let userList = await User.find({ git_name: { $regex: reg } }).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize))
        // let userList = await User.find({git_name:{$regex:reg}}).skip((pageNum-1)*pageSize).limit(parseInt(pageSize))
        let count = await User.find({ git_name: { $regex: reg } }).estimatedDocumentCount()
        if (userList) {
            res.json({
                code: 0,
                msg: '获取個人信息成功',
                userList,
                count,
            })
        } else {
            res.json({
                code: -1,
                msg: '获取個人信息失败',
            })
        }
    } catch (e) {
        res.json({
            code: -1,
            msg: '获取個人信息失败',
        })
    }
})
router.post('/getFans', async (req, res) => {
    try {
        const { user_id } = req.body
        const userList = await User.findOne({ _id: user_id })
        if (userList) {
            const fansIdList = userList.fans;
            const fansList = await User.find({ _id: fansIdList })
            if (fansList) {
                res.json({
                    code: 0,
                    msg: "获取粉丝列表成功",
                    fansList
                })
            }
        }
        res.json({
            code: -1,
            msg: '获取粉丝列表失败',
        })
    } catch (e) {
        res.json({
            code: -1,
            msg: '获取粉丝列表失败',
        })
    }
})
router.post('/getFollowers', async (req, res) => {
    try {
        const { user_id } = req.body
        const userList = await User.findOne({ _id: user_id })
        if (userList) {
            const followersIdList = userList.followers;
            const followersList = await User.find({ _id: followersIdList })
            if (followersList) {
                res.json({
                    code: 0,
                    msg: "获取关注列表成功",
                    followersList
                })
            }
        }
        res.json({
            code: -1,
            msg: '获取关注列表失败',
        })
    } catch (e) {
        res.json({
            code: -1,
            msg: '获取关注列表失败',
        })
    }
})
router.post('/follow', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const _id = req.body._id
        let author = await User.findOne({ _id })
        let fans = [...new Set([...author.fans, req.user._id])]
        if (author) {
            // 添加粉丝
            await User.updateOne({ _id }, { fans })
        } else {
            res.json({
                code: -1,
                msg: '添加粉丝失败',
            })
        }
        let user = await User.findOne({ _id: req.user._id })
        let followers = [...new Set([...user.followers, _id])]
        if (user) {
            // 添加关注者
            await User.updateOne({ _id: req.user._id }, { followers })
            let result = await User.find()
        } else {
            res.json({
                code: -1,
                msg: '添加关注失败',
            })
        }
        res.json({
            code: 0,
            msg: "操作成功"
        })

    } catch (e) {
        res.json({
            code: -1,
            msg: '获取個人信息失败',
        })
    }
})
router.post('/unfollow', passport.authenticate("jwt", { session: false }), async (req, res) => {
    // let book_id = new Set([1, 2, 3, 4])
    // book_id.delete(4)


    // 删除指定元素的骚操作
    try {
        const _id = req.body._id
        let author = await User.findOne({ _id })
        let fans = [...new Set(author.fans).delete(req.user._id)]
        if (author) {
            // 添加粉丝
            await User.updateOne({ _id }, { fans })
        } else {
            res.json({
                code: -1,
                msg: '添加粉丝失败',
            })
        }
        let user = await User.findOne({ _id: req.user._id })
        let followers = [...new Set(user.followers).delete(_id)]
        if (user) {
            // 添加关注者
            await User.updateOne({ _id: req.user._id }, { followers })
            let result = await User.find()
        } else {
            res.json({
                code: -1,
                msg: '添加关注失败',
            })
        }
        res.json({
            code: 0,
            msg: "操作成功"
        })

    } catch (e) {
        res.json({
            code: -1,
            msg: '获取個人信息失败',
        })
    }
})

module.exports = router;
