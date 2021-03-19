import Comment from "../model/comment";
import Pin from "../model/pin"
import Article from "../model/article"
const express = require("express");
const router = express.Router();

router.get('/getCount',async (req,res)=>{
    let comment  = await Comment.find({})
    let count = 0;
    count += comment.length
    comment.forEach(item=>{
        count += item.discuss.subDiscuss.length
    })
    return res.json({
        msg:'获取用户数成功',
        code:0,
        count,
    })
})
router.post('/addComment', async (req, res) => {
    let { commentTypeID, newDiscuss, commentType, authorID } = req.body
    let comment = await Comment.create({ commentTypeID, commentType, discuss: newDiscuss, authorID, create_time: new Date().getTime() })

    let commentCount = 0;
    let comments = await Comment.find({ commentTypeID })
    comments.map((item, index) => {
        commentCount = item.discuss.subDiscuss.length + commentCount + 1 // 需要加上它本身算一条。
    })
    let result
    if (comment.commentType === 'pin') {
        result = await Pin.updateOne({ _id: commentTypeID }, { commentCount })
    } else if (comment.commentType === 'article') {
        result = await Article.updateOne({ _id: commentTypeID }, { commentCount })
    }
    if (comment) {
        return res.json({
            code: 0,
            msg: '创建新的评论成功'
        })
    } else {
        return res.json({
            code: -1,
            msg: '创建失败'
        })
    }

})
router.post('/deleteComment', async (req, res) => {
    let { _id } = req.body
    let comment = await Comment.findOne({ _id })
    let result = await Comment.deleteOne({ _id })

    let commentCount = 0;
    let comments = await Comment.find({ commentTypeID:comment.commentTypeID })
    comments.map((item, index) => {
        commentCount = item.discuss.subDiscuss.length + commentCount + 1 // 需要加上它本身算一条。
    })
    if (comment.commentType === 'pin') {
        result = await Pin.updateOne({ _id: comment.commentTypeID }, { commentCount })
    } else if (comment.commentType === 'article') {
        result = await Article.updateOne({ _id: comment.commentTypeID }, { commentCount })
    }
    if (comment) {
        return res.json({
            code: 0,
            msg: '创建新的评论成功'
        })
    } else {
        return res.json({
            code: -1,
            msg: '创建失败'
        })
    }

})
router.post('/getComment', async (req, res) => {
    try {
        let { commentTypeID, commentType } = req.body
        let comments = await Comment.find({ commentType, commentTypeID })
        if (comments.length) {
            return res.json({
                code: 0,
                comments: comments
            })
        } else {
            return res.json({
                code: 0,
                msg: '空',
            })
        }
    } catch (e) {
        return res.json({
            code: -1,
            msg: e || e.message
        })
    }

})
router.post('/addRecall', async (req, res) => {
    let { selfName, inputOfRecall, _id, userId, cover } = req.body
    let comment = await Comment.findOne({ _id: _id })
    comment.discuss.subDiscuss.push({
        userId,
        selfName,
        inputOfRecall,
        cover,
        create_time: new Date().getTime()
    })
    let newDiscuss = comment.discuss
    let result = await Comment.updateOne({ _id: _id }, { discuss: newDiscuss })
    let commentCount = 0;
    const commentTypeID = comment.commentTypeID
    let comments = await Comment.find({ commentTypeID })
    comments.map((item, index) => {
        commentCount = item.discuss.subDiscuss.length + commentCount + 1 // 需要加上它本身算一条。
    })
    if (comment.commentType === 'pin') {
        result = await Pin.updateOne({ _id: commentTypeID }, { commentCount })
    } else if (comment.commentType === 'article') {
        result = await Article.updateOne({ _id: commentTypeID }, { commentCount })
    }
    if (result.ok) {
        return res.json({
            msg: '回复成功',
            code: 0
        })
    }
    return res.json({
        msg: '回复失败',
        code: 1
    })


})

module.exports = router;
