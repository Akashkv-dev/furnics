const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        required: true
    },
    
    bannerTitle: {
        type: String
    },

    bannerDescription: {
        type: String
    }
},{ autoCreate: true });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;