var mongoose = require('mongoose');
var personSchema = mongoose.Schema({
    name: String,
    author: String,
    pub: String
});
var Person = mongoose.model("Person", personSchema);

module.exports = Person;