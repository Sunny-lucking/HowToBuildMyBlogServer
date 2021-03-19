import mongoose from 'mongoose'
const Schema = mongoose.Schema
const UserSchema=new Schema({
  git_name:{
    type:String,
    unique:true,
    require:true
  },
  
  praiseCount:{ // 文章点赞数
    type:Number,
    require:false,
    default:0,
  },

  pvCount:{ // 文章阅读数
    type:Number,
    require:false,
    default:0,
  },
  _id:{
    type:Number,
    require:true
  },
  bio:{
    type:String,
    require:true
  },
  avatar_url:{ 
    type:String,
    require:false,
    default:''
  },
  company:{ 
    type:String,
    require:false,
    default:''
  },
  location:{ 
    type:String,
    require:false,
    default:''
  },
  followers:{ // 关注的人
    type:Array,
    require:false,
    default:[],
  },
  fans:{  // 粉丝
    type:Array,
    require:false,
    default:[],
  },
  favorites:{ // 收藏文章
    type:Array,
    require:false,
    default:[],
  },
  createTime:{
    type:Date,
    require:true,
  }
})

export default mongoose.model('User',UserSchema)
