import mongoose from 'mongoose'
const Schema = mongoose.Schema
const PinSchema=new Schema({
    pinTypeValue:{
        type:String,
        require:true
    },
    pinTypeLabel:{
        type:String,
        require:true
    },
    content:{
        type: String,
        require: true,
    },
    user_id:{
        type:String,
        require:true
    },
    user_name:{
        type:String,
        require:true
    },
    user_avatar:{
        type:String,
        require:true,
    },
    create_time:{
        type: Date,
        require:true
    },
    pvcount:{
        type:Number,
        require:false,
        default:0
    },
    // 点赞的用户id列表
    praiseList:{    
        type:Array,
        require:false,
        default: []
    },
    commentCount:{
        type:Number,
        require:false,
        default:0
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

export default mongoose.model('Pin',PinSchema)
