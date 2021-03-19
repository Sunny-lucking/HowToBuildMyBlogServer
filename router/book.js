import Book from "../model/book";
import Users from "../model/users"
import {basename} from "path"
import formidable from "formidable"
import config from "./../src/config"
import { join } from "path";
const express = require("express");
const router = express.Router();
let fs = require('fs');
router.get('/list',async (req,res) =>{
    try {
        let books = await Book.find();
        if (books){
            return res.json({
                books:books,
                msg:'获取资料成功',
                code:0
            })
        }else {
            return res.json({
                code:-1,
                msg:'获取资料失败'
            })
        }
    } catch (e) {
        res.json({
            msg:e.message|| e,
            code: -1
        })
    }
})
router.post('/delete',async (req,res) =>{
    const {_id} = req.body
    try {
        const {fileCoverUrl,zipFileUrl} = await Book.findOne({_id})
        console.log(config.publicPath + fileCoverUrl);

        // 删除文件封面
        fs.unlinkSync(config.publicPath + fileCoverUrl)
        // 删除文件
        fs.unlinkSync(config.publicPath + zipFileUrl)
        // 删除数据库中的文件对象
        let books = await Book.deleteOne({_id});
        if (books){
            return res.json({
                msg:'删除资料成功',
                code:0
            })
        }else {
            return res.json({
                code:-1,
                msg:'删除资料失败'
            })
        }
    } catch (e) {
        res.json({
            msg:e.message|| e,
            code: -1
        })
    }
})
router.post('/upload',  (req,res) =>{
    try{
        let form = new formidable.IncomingForm()
        form.uploadDir = join(config.publicPath,"/book")
        form.keepExtensions = true
        form.parse(req, async(err, fields, files)=> {
            const fileCover = "/book/"+basename(files.fileCover.path);
            const zipFile = "/book/" + basename(files.zipFile.path);
            const {fileTitle,fileDesc} = fields;
            const newBook = new Book({
                fileDesc,
                fileTitle,
                fileCoverUrl:fileCover,
                zipFileUrl:zipFile,
            })
            const result = await Book.create(newBook)
            if(result._id){
                res.json({
                    code:0,
                    msg:"成功"
                })
            }
        })
    }catch(e){
        console.log(e);
        res.json({
            code:0,
            msg:e.message|| e
        })
    }
})
router.post('/changeAvatar', (req,res) =>{
    let form = new formidable.IncomingForm()
    form.uploadDir = config.publicPath
    form.keepExtensions = true
    form.parse(req, async (err, fields, files)=> {
        let imageUrl = basename(files.file.path);
        let userId = fields.userId;
        let newUser = await Users.updateOne({_id:userId},{cover:imageUrl})
        res.json({
            newUser
        })
    })



})
// router.post('/addTag',async (req,res) =>{
//     let { articleID,tagName} = req.body
//     let tag = await Tag.find({tagName:tagName})
//     if(tag.length){
//         tag[0].articleIDs.push(articleID)
//         tag[0].save();
//         return res.json({
//             code:0,
//             msg:'文章已添加标签'
//         })
//     }else{
//         let TempTag = Tag.create({tagName,articleIDs:[articleID]})
//         if (TempTag) {
//             res.json({
//                 code:0,
//                 msg:'添加新标签成功'
//             })
//         }else {
//             res.json({
//                 code: -1,
//                 msg:'添加新标签失败'
//             })
//
//         }
//     }
//
// })
router.get('/getAllImage',async (req,res)=>{
    var files = await fs.readdirSync('public');

    files.shift();
    res.json({
        imageList:files
    })
})
module.exports = router;
