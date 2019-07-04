const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ImageSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100,
        unique: true
    },
    usersLikes: {
        type: Array,
        default: [],
        unique: true
    },

    urlImage: {
        type: String,
        required: true
    }


});


// Export the model
module.exports = mongoose.model('ImageSchema', ImageSchema);
// module.exports = CustomerModel;