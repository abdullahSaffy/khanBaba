var slug = require("mongoose-slug-generator");
var mongoose = require("mongoose");
mongoose.plugin(slug);

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: { type: String, slug: "title" },
});

module.exports = mongoose.model("Category", categorySchema);