const Category = require("../models/category");
const db = require("../config/db");
const mongoose = require("mongoose");

db();

async function seedDB() {
    const dbDisconnect = async function() {
        await mongoose.disconnect();
        console.log('disconnected');
    };
    const addCategory = async(title) => {
        try {
            const categories = new Category({
                title,
            });
            await categories.save();
            console.log("added: ", title);
        } catch (err) {
            console.log(err);
        }
    };

    await addCategory("Backpacks");
    await addCategory("Briefcases");
    await addCategory("Mini Bags");
    await addCategory("Large Handbags");
    await addCategory("Travel");
    await addCategory("Totes");
    await addCategory("Purses");

    await dbDisconnect();
}


seedDB();