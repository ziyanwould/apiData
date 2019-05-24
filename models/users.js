const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

// Schema
const usersSchema = new Schema({
   // _id: { type: ObjectId }, // 默认生成，不加也可以
    username: { type: String, required: [true,'username不能为空'] },
    password: { type: String, required: [true,'password不能为空'] },
    sex: { type: String, enum: ['man','woman'], required: [true,'sex不能为空'] },
    age: { type: Number, required: [true,'age不能为空'] },
    avatar: { type: String, default: '' }
})

// Model
const users = mongoose.model('users',usersSchema);

module.exports = users;