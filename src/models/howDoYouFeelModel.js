const mongoose = require('mongoose');

const howDoYouFeelUserSchema = new mongoose.Schema(
  {
    howDoYouFeelToday: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const HowDoYouFeel = new mongoose.model('HowDoYouFeel', howDoYouFeelUserSchema);

module.exports = HowDoYouFeel;
