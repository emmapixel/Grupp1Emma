//Here we lift in mongoose, so that we can set up a Schema.
const mongoose = require("mongoose");

//Here we create our model for how we want our mantras to look like.
//Here we create an MantraSchema-object that will be saved in our database.
const MantraSchema = mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    mantraText: {
        type: String,
        require: true,
    },
    cardColor: {
        type: String,
        required: false
    }
});

//Export our object so it becomes a module and get visible for the whole app.
module.exports = mongoose.model("Mantra", MantraSchema);