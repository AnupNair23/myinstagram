const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
   emailId: {
        type: String,
        required: true
    },
    password:  {
        type: String,
        required: true
    },
    imagesLiked: {
        type: Array,
        default: []
    }


});


// Export the model
module.exports = mongoose.model('UserSchema', UserSchema);
// module.exports = CustomerModel;