
const express = require("express");
const router = express.Router();
import Banner from "./../model/banner"
import formidable from 'formidable'
import config from "./../src/config"
import {basename} from 'path'
router.post('/addBanner',async (req,res)=>{
    // let {bannerName,url}  = req.body
    // parse a file upload
    let form = new formidable.IncomingForm();
    form.uploadDir = config.publicPath;
    form.keepExtensions = true
    form.parse(req, async function(err, fields, files) {
        if (err) return err;
        let imgUrl = basename(files.image.path)
        let url = fields.url;
        let bannerName = fields.bannerName;
        let newBanner = await Banner.create({imgUrl,url,bannerName})
        if (newBanner) {
            return res.json({
                newBanner,
                fields,
                code:0,
                msg:'创建新的轮播图成功'
            })
        }else{
            res.json({
                msg:'创建新的轮播图失败',
                code:-1
            })
        }
        // res.json({
        //     files
        // })
    });

    // let newBanner = await Banner.create({roleName,roleId,roleDesc,children})
    // if (newBanner){
    //     res.json({
    //         msg:'创建角色成功',
    //         code:0,
    //         banner:newBanner
    //     })
    // } else{
    //     res.json({
    //         msg:'创建角色失败',
    //         code:-1,
    //     })
    // }

})
// router.post('/setRoleRight',async (req,res)=>{
//     let {_id,children}  = req.body
//     let {nModified} = await Role.updateOne({_id},{children})
//     if (nModified===1){
//         return res.json({
//             msg:'修改权限成功',
//             code:0
//         })
//     } else{
//         return res.json({
//             msg:'修改权限失败',
//             code:-1
//         })
//     }
//
//
// })
router.post('/deleteBanner',async (req,res)=>{
    let {_id}  = req.body
    let {deletedCount} = await Banner.deleteOne({_id})
    if (deletedCount===1){
        return res.json({
            msg:'删除轮播图成功',
            code:0
        })
    } else{
        return res.json({
            msg:'删除轮播图失败',
            code:-1
        })
    }

//
})
// router.post('/editOneRole',async(req,res)=>{
//     const {_id} = req.body;
//     const {roleName,roleDesc,roleId} = req.body;
//     let {nModified} = await Role.updateOne({_id},{roleName,roleDesc,roleId})
//     if (nModified===1){
//         res.json({
//             msg:'修改成功',
//             code:0,
//         })
//     }else{
//         res.json({
//             msg:'修改失败',
//             code:-1
//         })
//     }
//
// })
router.get('/getBanner',async (req,res)=>{
    // let rights = await Right.find({});
    // let firstRights = rights.filter((item)=>{
    //     return
    // })
    // let firstRight = await Right.find({level:'一级'})
    // let secondRight = await Right.find({level:'二级'})
    // let thirdRight = await Right.find({level:'三级'})

    let banners = await Banner.find({})

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
    if (banners.length>0){
        res.json({
            code:0,
            msg:'获取轮播图列表成功',
            banners,
        })
    } else {
        res.json({
            code:-1,
            msg:'获取轮播图列表失败',
        })
    }
})
// router.get('/getOneRole',async (req,res)=>{
//     let {_id} = req.query
//     // let rights = await Right.find({});
//     // let firstRights = rights.filter((item)=>{
//     //     return
//     // })
//     // let firstRight = await Right.find({level:'一级'})
//     // let secondRight = await Right.find({level:'二级'})
//     // let thirdRight = await Right.find({level:'三级'})
//
//     let role = await Role.find({_id})
//
//     // secondRight.forEach(secondItem=>{
//     //     thirdRight.forEach(thirdItem=>{
//     //         //
//     //         if (secondItem.id === thirdItem.pId){
//     //             secondItem.children.push(thirdItem)
//     //         }
//     //     })
//     // })
//     // firstRight.forEach(firstItem=>{
//     //     secondRight.forEach(secondItem=>{
//     //         //
//     //         if (firstItem.id=== secondItem.pId){
//     //             firstItem.children.push(secondItem)
//     //         }
//     //     })
//     // })
//
//     // roles.forEach(roleItem=>{
//     //
//     //     firstRight.forEach(firstItem=>{
//     //         firstItem.children.forEach(secondItem=>{
//     //             secondItem.children.forEach(thirdItem=>{
//     //                 if (roleItem.rightId.includes(thirdItem.id)) {
//     //                     roleItem.children.push(firstItem)
//     //                 }
//     //             })
//     //         })
//     //     })
//     // })
//     if (role){
//         res.json({
//             code:0,
//             msg:'获取角色列表成功',
//             role:role[0],
//         })
//     } else {
//         res.json({
//             code:-1,
//             msg:'获取角色列表失败',
//         })
//     }
// })


module.exports = router;
