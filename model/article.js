import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ArticleSchema=new Schema({
    title:{
        type: String,
        require: true,
    },
    content:{
        type: String,
        require: true,
    },
    tag:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        require:true,
        default:"6809640407484334093"
    },
    categoryName:{
        type:String,
        require:true,
        default:"前端"
    },
    user_id:{
        type:String,
        require:true
    },
    // 点赞的用户id列表
    praiseList:{    
        type:Array,
        require:false,
        default: []
    },
    // 收藏的用户id列表
    favoriteList:{
        type:Array,
        require:false,
        default: []
    },
    commentCount:{
        type:Number,
        require:false,
        default:0
    },
    user_name:{
        type:String,
        require:true
    },
    create_time:{
        type: Date,
        require:true
    },
    cover:{
        type:String,
        require:true
    },
    pvcount:{
        type:Number,
        require:false,
        default:0
    },
    praise:{
        type:Number,
        require:false,
        default: 0
    },
    applaud:{
        type:Number,
        require:false,
        default:0
    },
    caonima:{
        type:Number,
        require:false,
        default:0
    },
    angry:{
        type:Number,
        require:false,
        default:0
    },
   
})

export default mongoose.model('Article',ArticleSchema)
