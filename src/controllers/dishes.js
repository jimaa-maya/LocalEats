/* eslint-disable no-console */
const { v4: uuidv4 } = require('uuid'); // For generating unique filenames
const { ref, uploadBytes, deleteObject } = require('firebase/storage');
// eslint-disable-next-line no-unused-vars
const multer = require('multer');
const storage = require('../services/firebaseConfig');
const Dishes = require('../models/dishes');

// getting all dishes

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dishes.find();
    // return dishes;
    res.json(dishes);
  } catch (error) {
    res.status(422).json({ message: 'The dish name is required' });
  }
};

// getting spesific dish by its id

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
      .json({ message: 'An error occured while fetching the dish' });
  }
};

// filtering dishes based on dishType and preference

const filterDishes = async (req, res) => {
  const { dishType, preference } = req.body;

  try {
    // building the query object based on the provided filters
    const query = {};

    if (dishType) {
      query.dishType = { $in: [dishType] }; // match dishes that have the specified dishType
    }

    if (preference) {
      query.preferences = { $in: [preference] }; // match dishes that have the specified preference
    }

    // Execute the query
    const filteredDishes = await Dishes.find(query);

    res.json(filteredDishes);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Invalid input. Please check your request' });
  }
};

// Searching nearby dishes

const getDishesByLocation = async (req, res) => {
  const { city, country } = req.query;

  try {
    // Find dishes with matching user location
    const dishes = await Dishes.find({
      'user_id.address.city': city,
      'user_id.address.country': country,
    });

    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dishes by location.' });
  }
};

// getting all the images of dishes

const fetchAllDishImages = async (req, res) => {
  try {
    const dishes = await Dishes.find({}, 'image_url'); // fetching only images of dishes

    const dishImages = dishes.map((dish) => {
      console.log('dish', dish);
      // converting Buffer data to base64
      const imageBase64 = dish.image_url?.toString('base64');
      console.log('imageBase64', imageBase64);

      if (!imageBase64) {
        // when imageBase64 is undefined or null
        return null;
      }

      // returning images and its id's

      return {
        dishId: dish.dish_id,
        imageUrl: `data:image/jpeg;base64, ${imageBase64}`,
      };
    });

    // filtering out null values in dishImages array
    const filteredDishImages = dishImages.filter((image) => image !== null);

    res.json(filteredDishImages);

    // res.json(dishImages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Failed to fetch dish images. Please try again later.',
    });
  }
};

// getting a single image by its id

const fetchDishImage = async (req, res) => {
  const { dishId } = req.params;

  try {
    // fetch the image url after finding the dish by its id

    const dish = await Dishes.findById(dishId, 'image_url');

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    if (!dish.image_url) {
      return res.status(404).json({ message: 'Dish image not available' });
    }

    // if dish and image exists convert buffer data to base64

    const imageBase64 = dish.image_url.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

    return res.status(200).json({ dishId: dish.dish_id, imageUrl });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// Creating a new dish (for dish owners (POST))

const createDish = async (req, res) => {
  try {
    const { dishName, description, price, dishType } = req.body;
    // eslint-disable-next-line camelcase
    // const { _id: user_id } = req.user; // Assuming the authenticated user's ID is stored in req.user._id

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    // Create a new file name for the image
    const fileName = `dishes/${uuidv4()}-${req.file.originalname}`;

    // Upload the image to Firebase Storage
    await uploadBytes(ref(storage, fileName), req.file.buffer, {
      contentType: req.file.mimetype,
    });

    // Get the public URL of the uploaded image
    const imageUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;

    // Create a new dish object
    const dish = new Dishes({
      dishName,
      description,
      // eslint-disable-next-line camelcase
      image_url: imageUrl,
      price,
      dishType,
      // eslint-disable-next-line camelcase
      // user_id, // Add the user_id to the dish object
    });

    // Save the dish to the database
    await dish.save();

    // Return the dish object
    return res.status(201).json(dish);
  } catch (error) {
    console.error('Error creating dish:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while creating the dish' });
  }
};

// Updating dish (for dish owners (PUT))

const updateDish = async (req, res) => {
  const { dishId } = req.params;
  const { dishName, description, price, dishType } = req.body;

  try {
    const dish = await Dishes.findById(dishId);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // updating dish fields with the new values
    dish.dishName = dishName;
    dish.description = description;
    dish.price = price;
    dish.dishType = dishType;
    await dish.save();

    return res.status(200).json({ message: 'Dish updated successfully ' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update dish' });
  }
};

// updating Dish Image (cooks allowed only) (PUT)

const updateDishImage = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dishes.findById(id);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // checking if a new image file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    // Get the existing image URL from the database
    const existingImageUrl = dish.image_url;

    // Create a new file name for the image
    const fileName = `dishes/${uuidv4()}-${req.file.originalname}`;

    // Upload the new image to Firebase Storage
    await uploadBytes(ref(storage, fileName), req.file.buffer, {
      contentType: req.file.mimetype,
    });

    // Get the public URL of the uploaded image
    const newImageUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;

    // Updating the dish's image_url with the new Firebase Storage URL
    dish.image_url = newImageUrl;
    await dish.save();

    // If there was an existing image, delete it from Firebase Storage
    if (existingImageUrl) {
      const existingFileName = existingImageUrl.split('/').pop();
      await deleteObject(ref(storage, `dishes/${existingFileName}`));
    }

    return res
      .status(200)
      .json({ message: 'Dish image updated successfully.' });
  } catch (error) {
    console.error('Error updating dish image:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while updating the dish image' });
  }
};

// removing a dish (dish owners allowed) (DELETE)

const removeDish = async (req, res) => {
  const { dishId } = req.params;

  try {
    // finding the dish and remove it

    const removedDish = await Dishes.findByIdAndRemove(dishId);

    if (!removedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    return res.json(removedDish);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'An error occured while removing the dish' });
  }
};

// Adding a dish review ( customer only) (POST)

const addReview = async (req, res) => {
  try {
    // taking dish id and review from req
    const { dishId } = req.params;
    const { review, rating } = req.body;

    // checking if dish exists
    const dish = await Dishes.findById(dishId);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // checking if the user has already added a review for this dish

    const existingReview = dish.review.find((r) =>
      r.user_id.equals(req.user_id)
    );

    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You have already reviewed this dish.' });
    }

    // creating a new review

    const newReview = {
      user_id: req.user_id,
      content: review,
      // eslint-disable-next-line object-shorthand
      rating: rating, // provided rating included
    };

    // adding the new review to the dish reviews array
    dish.review.push(newReview);

    // updating the overall rating for the dish
    const totalRating = dish.rating * dish.review.length + rating;
    const newRating = totalRating / (dish.review.length + 1);
    dish.rating = newRating;

    await dish.save();

    return res.status(200).json({ message: 'Review added successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occured while adding review' });
  }
};

// Updating Review of a Dish (customer only) (PUT)

const updateReview = async (req, res) => {
  const { dishId } = req.params;
  const { review: updatedReview, rating: updatedRating } = req.body;

  try {
    // find the dish by ID
    const dish = await Dishes.findById(dishId);

    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    // check if the user has already added a review for this dish
    const existingReview = dish.review.find((r) =>
      r.user_id.equals(req.user_id)
    );
    if (!existingReview) {
      return res
        .status(400)
        .json({ message: 'You have not reviewed this dish yet' });
    }

    // checking if the review update time frame is within a day (86400 seconds)
    const timeDifference = Date.now() - existingReview.updatedAt.getTime();
    const timeFrame = 86400 * 1000; // 1 day in milliseconds
    if (timeDifference >= timeFrame) {
      return res
        .status(400)
        .json({ message: 'Review update time frame has passed' });
    }

    // updating the review content and rating
    existingReview.content = updatedReview;
    existingReview.rating = updatedRating;

    // Recalculate the overall dish rating based on the updated reviews
    const totalRating = dish.review.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const newRating = (totalRating + updatedRating) / dish.review.length;

    dish.rating = newRating;

    await dish.save();

    return res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An error occurred while updating review' });
  }
};

module.exports = {
  getAllDishes,
  filterDishes,
  getDishById,
  fetchAllDishImages,
  fetchDishImage,
  getDishesByLocation,
  createDish,
  updateDish,
  updateDishImage,
  removeDish,
  addReview,
  updateReview,
};
