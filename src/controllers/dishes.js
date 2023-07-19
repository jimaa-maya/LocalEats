const multer = require('multer');
const Dishes = require('../models/dishes');
const User = require('../models/users');
const { upload } = require('../app');

// getting all dishes

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dishes.find();
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
    const query = {};

    // adding dishtype filter if provided

    if (dishType) {
      query.dishType = dishType;
    }

    // adding preference filter if provided

    if (preference) {
      query.preference = preference;
    }

    // execute the query

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
  const { city, province } = req.query;

  try {
    // find the users with matching location

    const users = await User.find({
      'address.city': city,
      'adress.province': province,
    }).select('dish_id');

    // get the dish id's from matching users

    const dishIds = users.map((user) => user.dish_id);

    // fetch the dishes based on the dish id

    const dishes = await Dishes.find({ dish_id: { $in: dishIds } });

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
      // converting Buffer data to base64
      const imageBase64 = dish.image_url.toString('base64');

      // returning images and its id's

      return {
        dishId: dish.dish_id,
        imageUrl: `data:image/jpeg;base64, ${imageBase64}`,
      };
    });

    res.json(dishImages);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch dish images. Please try again later.',
    });
  }
};

// getting a single image by its id

const fetchDishImage = async (req, res) => {
  const { dishId } = req.params;

  try {
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

// eslint-disable-next-line consistent-return
const createDish = async (req, res) => {
  try {
    // handling image upload
    upload.single('image')(req, res, async (err) => {
      // 'image' should match the name attribute of the file input field in the form
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          error:
            'Error uploading the file. Please check the file format and size.',
        });
      }
      // for non multer errors
      if (err) {
        return res
          .status(500)
          .json({ error: 'An error occurred during image upload' });
      }

      // if there is no errors; extract the necessary info from the req.body:
      const { dishName, description, price, dishType } = req.body;

      // creating a new dish
      const dish = new Dishes({
        dishName,
        description,
        image_url: req.file.buffer,
        price,
        dishType,
      });

      // saving to the database
      await dish.save();

      return res.status(201).json({ message: 'Dish created successfully' });
    });
  } catch (error) {
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

    // updating dish's image with the new file

    dish.image_url = req.file.buffer;

    // saving to the database
    await dish.save();

    return res.status(200).json({ message: 'Dish image updated succesfully.' });
  } catch (error) {
    return res
      .status(500)
      .json({ error: ' An error occured while updating the dish image ' });
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
