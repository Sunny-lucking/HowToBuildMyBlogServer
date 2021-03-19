import mongoose from 'mongoose'
const Schema = mongoose.Schema
const TagSchema=new Schema({
    articleIDs:{
        type:Array,
        require:false,
        default:[]
    },
    tagName:{
        type: String,
        require: true
    }
})

export default mongoose.model('Tag',TagSchema)
