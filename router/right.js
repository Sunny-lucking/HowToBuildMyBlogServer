
const express = require("express");
const router = express.Router();
import Right from "./../model/right"
const jwt = require("jsonwebtoken");
const passport = require("passport");     //引入passport中间件

router.get('/getRight',async (req,res)=>{

    let rights = await Right.find({})
    if (rights.length>0){
        res.json({
            code:0,
            msg:'获取权限列表成功',
            rights,
        })
    } else {
        res.json({
            code:-1,
            msg:'获取权限列表失败',
        })
    }
})
router.post('/addRight',async (req,res)=>{
    let {authName,id,level,pId,path} = req.body
    let result = await Right.create({authName, id, level, pId, path})
    if(result){
        return res.json({
            code:0,
            msg:"添加权限成功"
        })
    }else{
        return res.json({
            code:-1,
            msg:"添加权限失败"
        })
    }
    
})
router.post('/updateRight',async (req,res)=>{
    let {id,level,authName} = req.body
    let result = await Right.updateOne({authName},{level,id})
    return res.json({
        result
    })
})
router.post('/deleteRight',async (req,res)=>{
    let {_id}  = req.body
    let {deletedCount} = await Right.deleteOne({_id})
    if (deletedCount===1){
        return res.json({
            msg:'删除角色成功',
            code:0
        })
    } else{
        return res.json({
            msg:'删除角色失败',
            code:-1
        })
    }
})
router.post('/editOneRight',async(req,res)=>{
    const {_id} = req.body;
    const {authName,id,pId,level} = req.body;
    let {nModified} = await Right.updateOne({_id},{authName,id,pId,level})
    debugger
    if (nModified===1){
        res.json({
            msg:'修改成功',
            code:0,
        })
    }else{
        res.json({
            msg:'修改失败',
            code:-1
        })
    }

})
router.get('/getOneRight',async (req,res)=>{
    let {_id} = req.query
    let right = await Right.find({_id})

    if (right){
        res.json({
            code:0,
            msg:'获取角色列表成功',
            right:right[0],
        })
    } else {
        res.json({
            code:-1,
            msg:'获取角色列表失败',
        })
    }
})
module.exports = router;
