import Article from "../model/article";
import User from "../model/users";
import Tag from "../model/tag"
import formidable from "formidable"
import axios from "axios"
import config from "./../src/config"
import { basename } from 'path'
const passport = require("passport");     //引入passport中间件
const express = require("express");
const router = express.Router();
router.post('/delete', async (req, res) => {
    let { _id } = req.body
    let { deletedCount } = await Article.deleteOne({ _id })
    if (deletedCount === 1) {
        return res.json({
            msg: '删除文章成功',
            code: 0
        })
    } else {
        return res.json({
            msg: '删除文章失败',
            code: -1
        })
    }
})

router.get('/list', async (req, res) => {
    try {
        const { pageNum, pageSize, keyWord, user_id, cateId, tagId, followers, sortType, favorites } = req.query;
        const reg = new RegExp(keyWord, 'i')
        let queryQuote = {
            title: { $regex: reg },
        }
        let sortQuote = {
            sort: [{ 'create_time': -1 }]
        }
        if (user_id) {
            queryQuote.user_id = user_id
        }
        if (cateId && cateId !== 'following') {
            queryQuote.category = cateId
        } else if (cateId && cateId === 'following') {  // 如果前端传来的标签是following，表示要搜索用户的关注的文章
            queryQuote.user_id = followers
        }
        if (tagId && tagId !== '全部') { // 如果前端有传标签过来
            queryQuote.tag = tagId
        } else { // 如果是全部的話，不应该传tag。

        }
        if (favorites && favorites.length > 0) {
            queryQuote._id = favorites
        }
        if (sortType) {
            sortQuote = { sort: [{ [sortType]: -1 }] }
        }

        let articleList = await Article.find(queryQuote, null, sortQuote).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize))
        let count = await Article.find({ title: { $regex: reg } }).estimatedDocumentCount()

        if (articleList.length > 0) {
            res.json({
                code: 0,
                msg: '获取文章列表成功',
                articleList,
                count,
            })
        } else {
            res.json({
                code: 0,
                msg: '列表为空',
                articleList,
                count,
            })
        }
    } catch (e) {
        console.log(e);
        res.json({
            code: -1,
            msg: e.message || e,
        })
    }

})


//前端
router.post('/increaseFeelingOfArticle', async (req, res) => {
    let { articleID, attrName } = req.body
    let article = await Article.find({ _id: articleID })
    switch (attrName) {
        case 'praise':
            article[0].praise++;
            break;
        case 'applaud':
            article[0].applaud++;
            break;
        case 'caonima':
            article[0].caonima++;
            break;
        case 'angry':
            article[0].angry++;
            break;
    }
    article[0].save();
    if (article) {
        return res.json({
            article,
            code: 0
        })
    } else {
        return res.json({
            code: -1,
            mgs: "获取失败"
        })
    }
})
router.get('/getArticleOfHot', async (req, res) => {

    let articleOfHot = await Article.find({}).sort({ 'pvcount': -1 }).limit(6)

    if (articleOfHot) {
        return res.json({
            code: 0,
            msg: '获取热门文章成功',
            articleOfHot
        })
    } else {
        res.json({
            code: -1,
            mgs: "获取热门文章失败"
        })
    }
})
router.get('/getArticleOfRandom', async (req, res) => {

    let articleOfRandom = await Article.aggregate([{ $sample: { size: 6 } }])
    if (articleOfRandom) {
        return res.json({
            code: 0,
            msg: '获取随机文章成功',
            articleOfRandom
        })
    } else {
        res.json({
            code: -1,
            mgs: "获取随机文章失败"
        })
    }
})
router.get('/getArticleOfLatest', async (req, res) => {
    let { pageNum } = req.query
    let articles = await Article.find({}).sort({ 'time': -1 }).skip(pageNum * 10).limit(10);

    if (articles) {
        return res.json({
            articles,
            code: 0
        })
    } else {
        res.json({
            code: -1,
            mgs: "获取失败"
        })
    }
})
router.get('/getArticleByTagName', async (req, res) => {
    let { tagName, pageIndex, size } = req.query
    let index = parseInt(pageIndex)
    let pageSize = parseInt(size)
    let tagname = encodeURI(tagName)
    let article = await Article.find({ tag: tagName }).skip((index - 1) * pageSize).limit(pageSize).sort({ 'time': -1 })
    let articleOfHot = await Article.find({ tag: tagName }).limit(6).sort({ 'pvcount': -1 })
    let count = await Article.find({ tag: tagName }).countDocuments();
    if (article) {
        return res.json({
            article,
            count,
            articleOfHot,
            code: 0
        })
    } else {
        res.json({
            code: -1,
            mgs: "获取失败"
        })
    }
})
router.get('/getArticleByKeyWord', async (req, res) => {
    let { keyWord, pageIndex, size } = req.query
    let index = parseInt(pageIndex)
    let pageSize = parseInt(size)
    const reg = new RegExp(keyWord, 'i')
    let article = await Article.find({ title: { $regex: reg } }).skip((index - 1) * pageSize).limit(pageSize).sort({ 'time': -1 })
    let articleOfHot = await Article.find({ title: { $regex: reg } }).limit(6).sort({ 'pvcount': -1 })
    let count = await Article.find({ title: { $regex: reg } }).countDocuments()
    if (article) {
        return res.json({
            article,
            count,
            articleOfHot,
            code: 0
        })
    } else {
        return res.json({
            code: -1,
            mgs: "获取失败"
        })
    }
})
router.get('/getTitleListByKeyWord', async (req, res) => {
    let { keyWord } = req.query
    let titleList;
    const reg = new RegExp(keyWord, 'i')
    if (keyWord.trim() === '') {
        titleList = []
    } else {
        titleList = await Article.find({ title: { $regex: reg } }, { Id: 1, title: 1 })
    }


    if (titleList.length > 0) {
        return res.json({
            titleList,
        })
    } else {
        return res.json({
            code: -1,
            mgs: "获取失败"
        })
    }
})
router.post('/praise', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.body
        const article = await Article.findOne({ _id })

        // 修改文章的点赞数 
        let { praiseList } = article
        praiseList = [...new Set([...praiseList, req.user._id])]
        const result = await Article.updateOne({ _id }, { praiseList })

        // 作者的点赞数+1
        const user = await User.findOne({_id:article.user_id})
        await User.updateOne({_id:article.user_id},{praiseCount:user.praiseCount+1})
        if (result.ok) {
            return res.json({
                code: 0,
                msg: '操作成功'
            })
        } else {
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
router.post('/cancelPraise', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.body
        const article = await Article.findOne({ _id })

        // 修改文章点赞数
        let { praiseList } = article
        let praiseListSet = new Set(praiseList)
        praiseListSet.delete(req.user._id)
        praiseList = [...new Set(praiseListSet)]
        const result = await Article.updateOne({ _id }, { praiseList })

        // 作者点赞数-1
        // 作者的点赞数+1
        const user = await User.findOne({_id:article.user_id})
        await User.updateOne({_id:article.user_id},{praiseCount:user.praiseCount-1})

        if (result.ok) {
            return res.json({
                code: 0,
                msg: '操作成功'
            })
        } else {
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

router.post('/favorite', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const _id = req.user._id
        const { articleId } = req.body
        let article = await Article.findOne({ _id: articleId })
        let user = await User.findOne({ _id })
        let favoriteList = [...new Set([...article.favoriteList, _id])]
        let favorites = [...new Set([...user.favorites, articleId])]
        if (article) {
            // 添加收藏文章
            await Article.updateOne({ _id: articleId }, { favoriteList })
            await User.updateOne({ _id }, { favorites })
            res.json({
                code: 0,
                msg: '收藏成功',
            })
        } else {
            res.json({
                code: -1,
                msg: '收藏失败',
            })
        }

    } catch (e) {
        res.json({
            code: -1,
            msg: e,
        })
    }
})
router.post('/unfavorite', passport.authenticate("jwt", { session: false }), async (req, res) => {
    // let book_id = new Set([1, 2, 3, 4])
    // book_id.delete(4)
    // console.log(book_id)  //Set { 1, 2, 3 }


    // 删除指定元素的骚操作
    try {
        const { articleId } = req.body
        const _id = req.user._id
        let article = await Article.findOne({ _id: articleId })
        let user = await User.findOne({ _id })
        let favoriteList = [...new Set(article.favoriteList).delete(_id)]
        let favorites = [...new Set(user.favorites).delete(articleId)]
        if (article) {
            await Article.updateOne({ _id: articleId }, { favoriteList })
            await User.updateOne({ _id }, { favorites })
            res.json({
                code: 0,
                msg: "取消收藏成功"
            })
        } else {
            res.json({
                code: -1,
                msg: '取消收藏失败',
            })
        }

    } catch (e) {
        res.json({
            code: -1,
            msg: e.message || e,
        })
    }
})



router.post('/addMarkDownImg', async (req, res) => {

    let form = new formidable.IncomingForm();
    form.uploadDir = config.publicPath;
    form.keepExtensions = true
    form.parse(req, async function (err, fields, files) {
        if (err) return res.json({ errMessage: "上传失败" });
        let cover = "http://localhost:5001/" + basename(files.image.path)
        res.json({
            message: "上传成功",
            cover: cover
        })
    });
})
router.post('/add', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { title, content, tag, category } = req.body
    const result = await Article.create({ title, content, user_id: req.user._id, user_name: req.user.git_name, tag, category, categoryName,create_time: new Date().getTime() })
    if (result) {
        res.json({
            code: 0,
            msg: '发表成功'
        })
    } else {
        res.json({
            code: -1,
            msg: '发表失败'
        })
    }


    // let form = new formidable.IncomingForm();
    // form.uploadDir = config.publicPath;
    // form.keepExtensions = true
    // form.parse(req, async function(err, fields, files) {
    //     if (err) return res.json({errMessage:"上传失败"});
    //     let cover = "http://localhost:5001/"+ basename(files.image.path)
    //     res.json({
    //         message:"上传成功",
    //         cover:cover
    //     })
    // const {title,content,userId,username,time,tag,summary} = fields
    // const result = await Article.create({title,content,cover,userId,username,time:new Date().getTime(),tag,summary})
    // if(result){
    //     let tagInfo = await axios.post('http://localhost:5001/api/tag/addTag',{tagName:tag,articleID:result._id})
    //     res.json({
    //         code: 0,
    //         msg: '发表成功'
    //     })
    // }else{
    //     res.json({
    //         code:-1,
    //         msg: '发表失败'
    //     })
    // }
    // });




})
router.post('/edit', passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { title, content, tag, category, _id } = req.body
    const result = await Article.updateOne({ _id }, { title, content, user_id: req.user._id, user_name: req.user.git_name, tag, category, create_time: new Date().getTime() })
    if (result) {
        res.json({
            code: 0,
            msg: '修该成功'
        })
    } else {
        res.json({
            code: -1,
            msg: '修改失败'
        })
    }


    // let form = new formidable.IncomingForm();
    // form.uploadDir = config.publicPath;
    // form.keepExtensions = true
    // form.parse(req, async function(err, fields, files) {
    //     if (err) return res.json({errMessage:"上传失败"});
    //     let cover = "http://localhost:5001/"+ basename(files.image.path)
    //     res.json({
    //         message:"上传成功",
    //         cover:cover
    //     })
    // const {title,content,userId,username,time,tag,summary} = fields
    // const result = await Article.create({title,content,cover,userId,username,time:new Date().getTime(),tag,summary})
    // if(result){
    //     let tagInfo = await axios.post('http://localhost:5001/api/tag/addTag',{tagName:tag,articleID:result._id})
    //     res.json({
    //         code: 0,
    //         msg: '发表成功'
    //     })
    // }else{
    //     res.json({
    //         code:-1,
    //         msg: '发表失败'
    //     })
    // }
    // });




})
router.get('/detail', async (req, res) => {
    try {
        let { id } = req.query
        let article = await Article.findOne({ _id: id })

        // 文章阅读量+1 
        article.pvcount++;
        article.save();

        // 作者阅读量+1
        let user = await User.findOne({_id:article.user_id})
        await User.updateOne({_id:article.user_id},{pvCount:user.pvCount+1})

        if (article) {
            return res.json({
                article,
                code: 0
            })
        } else {
            res.json({
                code: -1,
                mgs: "获取失败"
            })
        }
    } catch (e) {
        res.json({
            code: -1,
            msg: e.message||e
        })
    }

})
router.get('/getNextAndLast', async (req, res) => {
    let { articleID } = req.query
    let nextArticle
    let lastArticle
    try {
        nextArticle = await Article.find({ '_id': { '$gt': articleID } }, { _id: 1, title: 1 }).sort({ '_id': 1 }).limit(1)
        lastArticle = await Article.find({ '_id': { '$lt': articleID }, }, { _id: 1, title: 1 }).sort({ '_id': -1 }).limit(1)
        return res.json({
            nextArticle: nextArticle,
            lastArticle: lastArticle,
            code: 0,
            msg: '获取成功'
        })
    } catch (e) {
        return res.json({
            nextArticle: { title: '没有下一篇了', _id: '' },
            lastArticle: { title: '没有上一篇了', _id: '' },
            code: 0,
            msg: '获取成功'
        })
    }



})
router.get('/getCountOfArticle', async (req, res) => {
    let count = await Article.find({}).estimatedDocumentCount()
    return res.json({
        count
    })
})


module.exports = router;

