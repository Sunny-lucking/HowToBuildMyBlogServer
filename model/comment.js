import mongoose from 'mongoose'
const Schema = mongoose.Schema
const CommentSchema=new Schema({
    commentTypeID:{ // 文章或者沸点的id
        type:String,
        require:false,
    },
    commentType:{    // 标识文章 或者 沸点的 评论
        type:String,
        require:false,
    },
    authorID:'', // 标识文章 或者 沸点 的作者id
    discuss:{
        type: Object,
        require: false,
        default: {
            username:'',
            inputOfComment:'',
            cover:'',
            subDiscuss:[],
            create_time:''
        }
    },
    create_time:{
        type:Date,
        require:true
    }
})

export default mongoose.model('Comment',CommentSchema)
