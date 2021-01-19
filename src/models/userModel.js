const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.virtual('HowDoYouFeel', {
  ref: 'HowDoYouFeel',
  localField: '_id',
  foreignField: 'owner',
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// statics are accessible in the whole model. In this case, going through the whole collection of users.
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login the user');
  }
  return user;
};

// Schema meethods are accessible in a single instance of a model. Contrast this to static methods.
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.TOKEN_SECRET
  );
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// this function generates a striped down version of the user profile data.
//removing the sensitive information such as password and tokens
// toJSON is defined here and will be automatically called by express when serving the routes
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
