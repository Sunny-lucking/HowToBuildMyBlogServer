import Tag from "../model/tag";

const express = require("express");
const router = express.Router();

router.get('/list', async (req, res) => {
    const categoryList = [
        {
            label: "后端", _id: '6809637769959178254', category_url: 'backend',
            tags: [
                {
                    _id: "全部",
                    label: "全部",
                },
                {
                    _id: "6809640445233070094",
                    label: "Java",
                },
                {
                    _id: "6809640408797167623",
                    label: "后端",
                },
                {
                    _id: "6809641037787561992",
                    label: "Spring Boot",
                },
                {
                    _id: "6809640364677267469",
                    label: "Go",
                },
                {
                    _id: "6809640448827588622",
                    label: "Python",
                },
                {
                    _id: "6809640703325372423",
                    label: "Spring",
                },
                {
                    _id: "6809640366896054286",
                    label: "MySQL",
                },
                {
                    _id: "6809640371019055111",
                    label: "Redis",
                },
                {
                    _id: "6809640600502009863",
                    label: "数据库",
                },
                {
                    _id: "6809640696455102472",
                    label: "JVM",
                },
                {
                    _id: "6809640499062767624",
                    label: "算法",
                },
                {
                    _id: "6809640501776482317",
                    label: "架构",
                },
                {
                    _id: "6809640385980137480",
                    label: "Linux",
                },
                {
                    _id: "6809640467731316749",
                    label: "设计模式",
                },
                {
                    _id: "6809641146378092552",
                    label: "Spring Cloud",
                }
            ]
        },
        {
            label: "前端", _id: '6809637767543259144', category_url: 'frontend',
            tags: [
                {
                    _id: "全部",
                    label: "全部",
                },
                { label: "JavaScript", _id: '6809640398105870343' },
                { label: "前端", _id: '6809640407484334093' },
                { label: "Vue.js", _id: '6809640369764958215' },
                { label: "React.js", _id: '6809640357354012685' },
                { label: "CSS", _id: '6809640394175971342' },
                { label: "Node.js", _id: '6809640361531539470' },
                { label: "Webpack", _id: '6809640528267706382' },
                { label: "面试", _id: '6809640404791590919' },
                { label: "微信小程序", _id: '6809640653266354190' },
            ]
        },
        {
            label: "Android", _id: '6809635626879549454', category_url: 'android',
            tags: [{ label: "Spring", _id: 0 }, { label: "Mysql", _id: 2 }, { label: "Java", _id: 1 }]
        },
        {
            label: "iOS", _id: '6809635626661445640', category_url: 'ios',
            tags: [{ label: "Spring", _id: 0 }, { label: "Mysql", _id: 2 }, { label: "Java", _id: 1 }]
        },
        {
            label: "人工智能", _id: '6809637773935378440', category_url: 'ai',
            tags: [{ label: "Spring", _id: 0 }, { label: "Mysql", _id: 2 }, { label: "Java", _id: 1 }]
        },
        {
            label: "开发工具", _id: '6809637771511070734', category_url: 'freebie',
            tags: [{ label: "Spring", _id: 0 }, { label: "Mysql", _id: 2 }, { label: "Java", _id: 1 }]
        },
    ]
    if (categoryList.length > 0) {
        res.json({
            code: 0,
            msg: '获取标签列表成功',
            categoryList,
        })
    } else {
        res.json({
            code: -1,
            msg: '获取标签列表失败',
        })
    }
})

router.post('/addTag', async (req, res) => {
    let { articleID, tagName } = req.body
    let tag = await Tag.find({ tagName: tagName })
    if (tag.length) {
        tag[0].articleIDs.push(articleID)
        tag[0].save();
        return res.json({
            code: 0,
            msg: '文章已添加标签'
        })
    } else {
        let TempTag = Tag.create({ tagName, articleIDs: [articleID] })
        if (TempTag) {
            res.json({
                code: 0,
                msg: '添加新标签成功'
            })
        } else {
            res.json({
                code: -1,
                msg: '添加新标签失败'
            })

        }
    }

})

module.exports = router;
