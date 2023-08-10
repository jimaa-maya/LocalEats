/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const upload = require('multer');
const fs = require('fs');
const { storage } = require('../services/firebaseConfig');
const {
  uploadImage,
  updateImage,
  deleteImage,
} = require('../services/firebaseConfig');
const Dishes = require('../models/dishes');
const Users = require('../models/users');

// getting all the dishes
const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dishes.find();
    return res.json(dishes);
  } catch (error) {
    return res.status(422).json({ message: 'The dish name is required' });
  }
};

// getting specific dish by its ID
const getDishById = async (req, res) => {
  const { id } = req.params;

  try {
    const dish = await Dishes.findById(id);

    if (!dish) {
      return res
        .status(404)
        .json({ message: 'The dish you are looking for was not found' });
    }

    return res.json(dish);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred while fetching the dish' });
  }
};

// filtering dishes based on dishType and preference
const filterDishes = async (req, res) => {
  const { dishType, preferences } = req.body;

  try {
    const query = {};

    if (dishType) {
      query.dishType = { $in: [dishType] };
    }

    if (preferences) {
      query.preferences = { $in: [preferences] };
    }
    console.log(preferences);
    console.log(dishType);

    const filteredDishes = await Dishes.find(query);
    console.log(filteredDishes);

    return res.json(filteredDishes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Invalid input. Please check your request' });
  }
};

// searching nearby dishes
const getDishesByLocation = async (req, res) => {
  const { city, country } = req.query;

  try {

    // find the users with matching location

    const users = await User.find({
      'address.city': city,
      'adress.province': province,
      'role' : 'cook',
    }).select('user_id');

    // fetch the dishes
    const dishes = await Dishes.find({
      'user_id': users,
    });

    return res.json(dishes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch dishes by location.' });
  }
};

// getting all the images of dishes
const fetchAllDishImages = async (req, res) => {
  try {
    const dishes = await Dishes.find({}, 'image_url');

    const dishImages = dishes.map((dish) => {
      const imageBase64 = dish.image_url?.toString('base64');

      if (!imageBase64) {
        return null;
      }

      return {
        _id: dish._id,
        imageUrl: `data:image/jpeg;base64, ${imageBase64}`,
      };
    });

    const filteredDishImages = dishImages.filter((image) => image !== null);

    return res.json(filteredDishImages);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to fetch dish images. Please try again later.',
    });
  }
};

// getting a single image by its ID
const fetchDishImage = async (req, res) => {
  const { _id } = req.params;

  try {
    const dish = await Dishes.findById(_id, 'image_url');

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    if (!dish.image_url) {
      return res.status(404).json({ message: 'Dish image not available' });
    }
    // converting image url
    const imageBase64 = dish.image_url.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

    return res.status(200).json({ _id: dish._id, imageUrl });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// creating a new dish (for dish owners)

const createDish = async (req, res) => {
  // eslint-disable-next-line no-unused-vars, camelcase
  const { dishName, description, price, dishType, preferences } = req.body;

  try {
    // checking if image is uploaded
    let imageUrl = '';
    if (req.file) {
      console.log('File Buffer:', req.file.buffer);
      const contentType = req.file.mimetype;
      console.log('Content Type:', req.file.mimetype);
      // Extract the file extension from originalname
      const fileExtension = req.file.originalname
        .split('.')
        .pop()
        .toLowerCase();

      // Create a new file name with the correct extension
      const newFileName = `${uuidv4()}.${fileExtension}`;

      console.log('req.file:', req.file);

      // upload the image to the firebase storage
      imageUrl = await uploadImage(req.file.buffer, newFileName);
    }

    const user = await Users.findOne();

    // creating a new dish with the user ID
    const dish = new Dishes({
      dishName,
      description,
      price,
      dishType,
      preferences,
      // eslint-disable-next-line camelcase
      image_url: imageUrl,
      // eslint-disable-next-line no-underscore-dangle
      user_id: user._id,
    });

    await dish.save();

    return res.status(201).json({ message: 'Dish created successfully', dish });
  } catch (error) {
    console.error('Error creating dish:', error);
    return res.status(500).json({ message: 'Failed to create dish' });
  }
};

// removing a dish (dish owners allowed)
const removeDish = async (req, res) => {
  const { _id } = req.params;

  try {
    const removedDish = await Dishes.findByIdAndRemove(_id);

    if (!removedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    return res.json(removedDish);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occurred while removing the dish' });
  }
};

// updating dish (for dish owners)

/* const updateDish = async (req, res) => {
  const { _id } = req.params;
  const { dishName, description, price, dishType } = req.body;

  // validating dishId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: 'Invalid dishId' });
  }

  try {
    const dish = await Dishes.findById(_id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    dish.dishName = dishName;
    dish.description = description;
    dish.price = price;
    dish.dishType = dishType;

    await dish.save();

    return res.status(200).json({ message: 'Dish updated successfully', dish });
  } catch (error) {
    console.error('Error updating dish:', error);
    return res.status(500).json({ message: 'Failed to update dish' });
  }
};

// updating the dish image:

const updateDishImage = async (req, res) => {
  const { _id } = req.params;

  try {
    const dish = await Dishes.findById(_id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // getting the existing image URL
    const existingImageUrl = dish.image_url?.toString();

    // Extract the file extension from originalname
    let fileExtension = '';
    if (existingImageUrl) {
      fileExtension = existingImageUrl.split('.').pop().toLowerCase();
    }

    // Create a new file name with the correct extension
    const newFileName = `${uuidv4()}.${fileExtension}`;

    // updating the image in firebase storage and getting the new image URL
    const imageUrl = await updateImage(
      req.file.buffer,
      req.file.mimetype,
      existingImageUrl,
      newFileName
    );

    // setting the new image url in the model
    dish.image_url = imageUrl;

    await dish.save();

    // deleting the old image from firebase storage
    if (existingImageUrl) {
      await deleteImage(existingImageUrl);
    }

    return res
      .status(200)
      .json({ message: 'Dish image updated successfully', dish });
  } catch (error) {
    console.error('Error updating dish image:', error);
    return res.status(500).json({ message: 'Failed to update dish image' });
  }
};
*/

// adding a dish review (customer only)
/* const addReview = async (req, res) => {
  try {
    const { _id } = req.params;
    const { review, rating } = req.body;

    const dish = await Dishes.findById(_id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    const existingReview = dish.review.find((r) =>
      r.user_id.equals(req.user_id)
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this dish.' });
    }

    const newReview = {
      user_id: req.user_id,
      content: review,
      rating,
    };

    dish.review.push(newReview);

    const totalRating = dish.rating * dish.review.length + rating;
    const newRating = totalRating / (dish.review.length + 1);
    dish.rating = newRating;

    await dish.save();

    return res.status(200).json({ message: 'Review added successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while adding review' });
  }
};

// updating review of a dish (customer only)
const updateReview = async (req, res) => {
  const { _id } = req.params;
  const { review: updatedReview, rating: updatedRating } = req.body;

  try {
    const dish = await Dishes.findById(_id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // ensuring req.user_id is defined and has a valid value
    if (!req.user_id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingReview = dish.review.find((r) => {
      // checking if r.user_id is defined and has a valid value
      if (r.user_id && r.user_id.equals(req.user_id)) {
        return true;
      }
      return false;
    });

    if (!existingReview) {
      return res
        .status(400)
        .json({ message: 'You have not reviewed this dish yet' });
    }

    const timeDifference = Date.now() - existingReview.updatedAt.getTime();
    const timeFrame = 86400 * 1000; // 1 day in milliseconds
    if (timeDifference >= timeFrame) {
      return res
        .status(400)
        .json({ message: 'Review update time frame has passed' });
    }

    existingReview.content = updatedReview;
    existingReview.rating = updatedRating;

    const totalRating = dish.review.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const newRating = (totalRating + updatedRating) / dish.review.length;

    dish.rating = newRating;

    await dish.save();

    return res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while updating review' });
  }
};
*/

module.exports = {
  getAllDishes,
  filterDishes,
  getDishById,
  fetchAllDishImages,
  fetchDishImage,
  getDishesByLocation,
  createDish,
  // updateDish,
  // updateDishImage,
  removeDish,
  // addReview,
  // updateReview,
};
