const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 4 },
    role: { type: String, default: 'customer' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.userId = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
