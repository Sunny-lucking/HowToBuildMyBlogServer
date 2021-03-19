import mongoose from 'mongoose'
const Schema = mongoose.Schema
const EventSchema=new Schema({
    eventDesc:{
        type: String,
        require: true
    },
    eventTitle:{
        type: String,
        require: true
    },
    eventTime:{
        type: String,
        require: true
    },
    eventCoverUrl:{
        type: String,
        require: true
    },
    eventLink:{
        type: String,
        require: true
    }
    
})

export default mongoose.model('Event',EventSchema)
