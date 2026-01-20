// Read-only schema for calculating user's total costs
// Users service can READ from costs collection but never WRITE
const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    description: String,
    category: String,
    userid: Number,
    sum: Number,
    date: Date
}, {
    versionKey: false,
    collection: 'costs'
});

module.exports = mongoose.model('Cost', costSchema);