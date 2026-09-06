const mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty'
    },
    phone: {
        type: String,
        required: 'Phone number can\'t be empty'
    },
    message: {
        type: String,
        required: 'Message can\'t be empty'
    },
});


module.exports = mongoose.model("Contact", contactSchema);