const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const registerSchema = new Schema({
  name: String,
  email: String,
  password: String
});

registerSchema.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();
  if (user.password) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) next(err);
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) next(err);
        user.password = hash;
        next(err);
      });
    });
  }
});

registerSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("registration", registerSchema);
