import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RightSchema = new Schema({
    authName:{
        type:String,
        require:true,
        default:'管理'
    },
    id:{
      type:Number,
      require:true,
      default:0
    },
    level:{
        type:String,
        require:true,
        default:'项目负责人'
    },
    pId:{
        type:Number,
        require:false,
        default:34
    },
    path:{
        type:String,
        require:true
    },
    is_enable:{
        type:Boolean,
        require:false,
        default:true
    },
    children:{
        type:Array,
        require:false,
        default:[]
    }
});

export default mongoose.model('Right',RightSchema)
