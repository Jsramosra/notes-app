const mongo = require('mongoose');
const {Schema} = mongo;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: { type: Date, default: Date.now}
});

userSchema.methods.encryptPassword = async (password) =>{
 const salt = await bcrypt.genSalt(10);
 const hash= bcrypt.hash(password, salt);
 return hash;
};

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongo.model('User', userSchema);