import Pin from "../model/pin";

const express = require("express");
const router = express.Router();
const passport = require("passport");     //引入passport中间件
router.post('/addPin', async (req, res) => {
    let { content, pinTypeValue, pinTypeLabel, user_id, user_name, user_avatar, } = req.body
    let pin = await Pin.create({ content, user_id, user_name, user_avatar, pinTypeValue, pinTypeLabel, create_time: new Date().getTime() })
    if (pin) {
        return res.json({
            code: 0,
            msg: '创建新的沸点成功'
        })
    } else {
        return res.json({
            code: -1,
            msg: '创建失败'
        })
    }

})

router.post('/deletepin', async (req, res) => {
    let { _id } = req.body
    let { deletedCount } = await Pin.deleteOne({ _id })
    if (deletedCount === 1) {
        return res.json({
            msg: '删除沸点成功',
            code: 0
        })
    } else {
        return res.json({
            msg: '删除沸点失败',
            code: -1
        })
    }
})
router.post('/getPin', async (req, res) => {
    const { pageNum, pageSize, keyWord, user_id,pinType, } = req.body;
    console.log(pageNum, pageSize, keyWord, user_id,pinType);
    const reg = new RegExp(keyWord, 'i')
    let queryQuote = {
        content: { $regex: reg },
    }
    if (user_id){
        queryQuote.user_id = user_id
    }
    // let count = await Pin.find({ title: { $regex: reg } }).estimatedDocumentCount()
    try {
        const { pinType } = req.body
        let pins = []
        let count = 0
        if (pinType === 'recommended') {
            pins = await Pin.find(queryQuote)
            count = await Pin.find(queryQuote).estimatedDocumentCount()
        } else if (pinType === 'hot') {
            pins = await Pin.find(queryQuote)
            count = await Pin.find(queryQuote).estimatedDocumentCount()
        } else if (pinType === 'following') {
            pins = await Pin.find(queryQuote)
            count = await Pin.find(queryQuote).estimatedDocumentCount()
        } else if (pinType){
            pins = await Pin.find({ pinTypeValue: pinType })
            count = await Pin.find({ pinTypeValue: pinType }).estimatedDocumentCount()
        } else if (pageNum){
            pins = await Pin.find(queryQuote).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize)).sort({ time: -1 })
            count = await Pin.find(queryQuote).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize)).sort({ time: -1 }).estimatedDocumentCount()
        } else {
            pins = await Pin.find().sort({ time: -1 })
            count = await Pin.find().sort({ time: -1 }).estimatedDocumentCount()
        }
        if (pins.length) {
            return res.json({
                code: 0,
                pins: pins,
                count,
            })
        } else {
            return res.json({
                code: 0,
                msg: '空'
            })
        }
    } catch (e) {
        return res.json({
            code: -1,
            msg: e.message|| e
        })
    }

})
router.post('/detail',async (req,res)=>{
    const {_id} = req.body
    const pin = await Pin.findOne({_id})
    await Pin.updateOne({_id},{pvcount:pin.pvcount+1})  
    res.json({
        msg:"获取沸点成功"
    })
})
router.post('/praise', passport.authenticate("jwt",{session:false}),async (req, res) => {
    try {
        const { _id } = req.body
        const pins = await Pin.findOne({_id})
        let {praiseList} = pins
        praiseList = [...new Set([...praiseList,req.user._id])]
        const result = await Pin.updateOne({_id},{praiseList})
        if(result.ok){
            return res.json({
                code: 0,
                msg: '操作成功'
            })
        }else{
            return res.json({
                code: -1,
                msg: '操作失败'
            })
        }
            
        // }
    } catch (e) {
        return res.json({
            code: -1,
            msg: e.message || e
        })
    }

})
router.post('/cancelPraise', passport.authenticate("jwt",{session:false}),async (req, res) => {
    try {
        const { _id } = req.body
        const pins = await Pin.findOne({_id})
        let {praiseList} = pins
        let praiseListSet = new Set(praiseList)
        praiseListSet.delete(req.user._id)
        praiseList = [...new Set(praiseListSet)]
        const result = await Pin.updateOne({_id},{praiseList})
        if(result.ok){
            return res.json({
                code: 0,
                msg: '操作成功'
            })
        }else{
            return res.json({
                code: -1,
                msg: '操作失败'
            })
        }
            
        // }
    } catch (e) {
        return res.json({
            code: -1,
            msg: e.message || e
        })
    }

})
router.post('/addRecall', async (req, res) => {
    let { selfName, inputOfRecall, _id, userId, cover } = req.body
    let comments = await Comment.find({ _id: _id })
    comments[0].discuss.subDiscuss.push({
        userId,
        selfName,
        inputOfRecall,
        cover,
        create_time: new Date().getTime()
    })
    let newDiscuss = comments[0].discuss
    let result = await Comment.updateOne({ _id: _id }, { discuss: newDiscuss })
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
