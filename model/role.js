import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    roleName:{
        type:String,
        require:true,
        default:'项目主管'
    },
    roleDesc:{
        type:String,
        require:true,
        default:'项目负责人'
    },
    roleId:{
        type:Number,
        require:false,
        default:0
    },
    children:{
        type:Array,
        require:false,
        default:[]
    },
});

export default mongoose.model('Role',RoleSchema)
