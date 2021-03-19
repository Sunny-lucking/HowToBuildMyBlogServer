import Admin from "../model/admin";
import jwt_decode from "jwt-decode";
const express = require("express");
const router = express.Router();
import Role from "./../model/role"
import Right from "./../model/right"
const jwt = require("jsonwebtoken");
const passport = require("passport");     //引入passport中间件
router.post('/addRole',async (req,res)=>{
    let {roleName,roleId,roleDesc}  = req.body

    let firstRight = await Right.find({level:'一级'})
    let secondRight = await Right.find({level:'二级'})
    let thirdRight = await Right.find({level:'三级'})
    secondRight.forEach(secondItem=>{
        thirdRight.forEach(thirdItem=>{
            //
            if (secondItem.id === thirdItem.pId){
                secondItem.children.push(thirdItem)
            }
        })
    })
    firstRight.forEach(firstItem=>{
        secondRight.forEach(secondItem=>{
            //
            if (firstItem.id=== secondItem.pId){
                firstItem.children.push(secondItem)
            }
        })
    })
    let children = firstRight;
    let newRole = await Role.create({roleName,roleId,roleDesc,children})
    if (newRole){
        res.json({
            msg:'创建角色成功',
            code:0,
            role:newRole
        })
    } else{
        res.json({
            msg:'创建角色失败',
            code:-1,
        })
    }

})
router.post('/setRoleRight',async (req,res)=>{
    let {_id,children}  = req.body
    console.log(_id);
    console.log(children);
    let {nModified} = await Role.updateOne({_id},{children})
    console.log(nModified);
    if (nModified===1){
        return res.json({
            msg:'修改权限成功',
            code:0
        })
    } else{
        return res.json({
            msg:'修改权限失败',
            code:-1
        })
    }


})
router.post('/deleteRole',async (req,res)=>{
    let {_id}  = req.body
    let {deletedCount} = await Role.deleteOne({_id})
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
router.post('/editOneRole',async(req,res)=>{
    const {_id} = req.body;
    const {roleName,roleDesc,roleId} = req.body;
    let {nModified} = await Role.updateOne({_id},{roleName,roleDesc,roleId})
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
router.get('/getRole',async (req,res)=>{
    let roles = await Role.find({})

    // secondRight.forEach(secondItem=>{
    //     thirdRight.forEach(thirdItem=>{
    //         //
    //         if (secondItem.id === thirdItem.pId){
    //             secondItem.children.push(thirdItem)
    //         }
    //     })
    // })
    // firstRight.forEach(firstItem=>{
    //     secondRight.forEach(secondItem=>{
    //         //
    //         if (firstItem.id=== secondItem.pId){
    //             firstItem.children.push(secondItem)
    //         }
    //     })
    // })

    // roles.forEach(roleItem=>{
    //
    //     firstRight.forEach(firstItem=>{
    //         firstItem.children.forEach(secondItem=>{
    //             secondItem.children.forEach(thirdItem=>{
    //                 if (roleItem.rightId.includes(thirdItem.id)) {
    //                     roleItem.children.push(firstItem)
    //                 }
    //             })
    //         })
    //     })
    // })
    if (roles.length>0){
        res.json({
            code:0,
            msg:'获取角色列表成功',
            roles,
        })
    } else {
        res.json({
            code:-1,
            msg:'获取角色列表失败',
        })
    }
})
router.get('/getOneRole',async (req,res)=>{
    let {_id} = req.query
    let role = await Role.find({_id})

    if (role){
        res.json({
            code:0,
            msg:'获取角色列表成功',
            role:role[0],
        })
    } else {
        res.json({
            code:-1,
            msg:'获取角色列表失败',
        })
    }
})
router.get('/getSelfRole',async (req,res)=>{
    let token = req.headers.authorization
    const decode = jwt_decode(token);
    let admin = await Admin.findOne({name:decode.name})
    let role = await Role.findOne({roleId:admin.roleId})
    if (role){
        res.json({
            code:0,
            msg:'获取角色列表成功',
            role
        })
    } else {
        res.json({
            code:-1,
            msg:'获取角色列表失败',
        })
    }
})

module.exports = router;
