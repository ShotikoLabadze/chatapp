const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", function () {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
});

module.exports = mongoose.model("User", userSchema);
