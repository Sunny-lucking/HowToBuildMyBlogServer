import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:false,
        default:''
    },
    phone:{
        type:String,
        require:false,
        default:'123456'
    },
    create_time:{
        type:Date,
        require:false,
        default:1582361351
    },
    state:{
        type:Boolean,
        require:false,
        default:true
    },
    roleId:{
        type:Number,
        require:false,
        default:1
    }
});

export default mongoose.model('Admin',AdminSchema)
