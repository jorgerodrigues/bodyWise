const express = require('express');
const HowDoYouFeel = require('../models/howDoYouFeelModel');
const authentication = require('../middleware/authentication');
const router = new express.Router();

//get /updates/me?sortBy=createdAt:desc
router.get('/updates/me', authentication, async (req, res) => {
  try {
    await req.user
      .populate({
        path: 'HowDoYouFeel',
        options: {
          sort: {
            createdAt: -1,
          },
        },
      })
      .execPopulate();
    res.send(req.user.HowDoYouFeel);
  } catch (e) {
    res.send(e);
  }
});

router.get('/updates/latest', authentication, async (req, res) => {
  const itemToBeDisplayed = await HowDoYouFeel.findOne({
    owner: req.user._id,
  }).sort({
    createdAt: -1,
  });
  if (!itemToBeDisplayed) {
    return res.status(400).send('Item not found');
  }

  try {
    res.send(itemToBeDisplayed);
  } catch (e) {
    res.send(e.message);
  }
});

router.get('/updates/item/:id', authentication, async (req, res) => {
  1;
  const itemToBeDisplayed = await HowDoYouFeel.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!itemToBeDisplayed) {
    return res.status(400).send('Item not found');
  }

  try {
    res.send(itemToBeDisplayed);
  } catch (e) {
    res.send(e.message);
  }
});

router.post('/me/how-do-you-feel', authentication, async (req, res) => {
  const newUpdate = new HowDoYouFeel({
    howDoYouFeelToday: req.body.howDoYouFeelToday,
    comments: req.body.comments,
    owner: req.user._id,
  });
  if (!newUpdate) {
    throw new Error('Nothing to create!');
  }
  try {
    await newUpdate.save();
    res.send(newUpdate);
  } catch (e) {
    res.status(500).send(e);
  }
});

// ##### Update #####

router.patch('/updates/:id', authentication, async (req, res) => {
  // this extracts the keys from the body of the request.
  const validOperations = ['howDoYouFeelToday', 'comments'];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) => {
    return validOperations.includes(update);
  });

  if (!isValidOperation) {
    return res.status(500).send('Invalid operation!');
  }

  try {
    const itemToBeUpdated = await HowDoYouFeel.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!itemToBeUpdated) {
      return res.status(404).send('Item not found');
    }

    updates.forEach((update) => {
      itemToBeUpdated[update] = req.body[update];
    });
    await itemToBeUpdated.save();
    res.send(itemToBeUpdated);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.delete('/updates/:id', authentication, async (req, res) => {
  const itemToBeDeleted = await HowDoYouFeel.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });
  console.log(itemToBeDeleted);

  if (!itemToBeDeleted) {
    return res.status(400).send('Item could not be found');
  }

  try {
    await HowDoYouFeel.deleteOne({ _id: itemToBeDeleted._id });
    res.send(`The following item was deleted successfully: ${itemToBeDeleted}`);
  } catch (e) {
    res.send(e.message);
  }
});

module.exports = router;
