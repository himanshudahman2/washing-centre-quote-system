const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    countryName: String,
    cityAddress: String,
    zipCode: String,
    companyName: String,
    phoneNumber: String,
    alternatePhone: String,
    services: [String],
    homeSize: String,
    Patiolength: Number,
    GutterGuard: String,
    exteriorType: String,
    additionalNotes: String // Added additionalNotes field
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
