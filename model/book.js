import mongoose from 'mongoose'
const Schema = mongoose.Schema
const BookSchema=new Schema({
    fileDesc:{
        type: String,
        require: true
    },
    fileTitle:{
        type: String,
        require: true
    },
    fileCoverUrl:{
        type: String,
        require: true
    },
    zipFileUrl:{
        type: String,
        require: true
    }
    
})

export default mongoose.model('Book',BookSchema)
