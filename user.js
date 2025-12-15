const mongoose = require("mongoose");

const ShoppingItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    checked: { type: Boolean, default: false },
    source: {
      type: String,
      enum: ["custom", "recipe", "pantry"],
      default: "custom",
    },
    recipeId: { type: String, default: null },
    pantryId: { type: String, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true },

  shoppingList: {
    type: [ShoppingItemSchema],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
