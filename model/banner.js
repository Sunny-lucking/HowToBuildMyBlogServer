import mongoose from 'mongoose'
const Schema = mongoose.Schema
const BannerSchema=new Schema({
    url:{
        type:String,
        require:true
    },
    bannerName:{
        type:String,
        require: false,
        default:''
    },
    imgUrl:{
        type:String,
        require: true,
        default:''
    }
})

export default mongoose.model('Banner',BannerSchema)
