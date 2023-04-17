// controllers/cropController.js

const Crop = require('../models/crop');
const User = require('../models/user');
const  {ObjectId} = require('mongoose').Types;

function encodeObjectId(id) {
    return ObjectId(decodeURIComponent(id).split('"')[1]);
}

exports.addcrop = async (req, res) => {
  try {
    // let id = decodeURIComponent(req.body.farmer).split('"')[1];
    // req.body.farmer = ObjectId(id);
    req.body.farmer = encodeObjectId(req.body.farmer);
    const crop = await Crop.create(req.body);
    res.status(201).json({ message: 'Crop details created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error,L:'Internal server error' });
  }
};

exports.allcrop = async (req, res) => {
  try {
    const crops = await Crop.find({}).populate('farmer').populate('distributor').populate('retailer');
    res.status(200).json(crops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.mycrop = async (req, res) => {
    try {
      const farmer = encodeObjectId(req.params.id);
      const crops = await Crop.find({farmer}).populate('farmer').populate('distributor').populate('retailer');
      res.status(200).json(crops);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

exports.buycrop = async (req, res) => {
  try {
    const crop = await Crop.find({retailer: undefined}).populate('farmer');
    if (!crop) {
      return res.status(404).json({ message: 'crop details not found' });
    }
    res.status(200).json(crop);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updatecrop = async (req, res) => {
  try {
    const retailer = encodeObjectId(req.body.userId);
    const username = req.body.distributor;
    const user = await User.findOne({username});
    const distributor = user._id;
    console.log(distributor);
    const crop = await Crop.findByIdAndUpdate(req.body.cropId, {retailer, distributor}, { new: true });
    if (!crop) {
      return res.status(404).json({ message: 'crop details not found' });
    }
    res.status(200).json({ message: 'crop details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
