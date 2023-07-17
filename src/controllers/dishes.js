const Dishes = require('../models/dishes');

// To-do's:
// get controllers: getAllDishes(public), get nearby dishes(private), filter dishes (public)
// get spesific dish (public), fetch all dish images (public),
// fetch dish image (public),search dishes.(public)

// put controllers: (user:cook update dish image, user: cook update dish, update review based on its id
// user: user but put spesific timeframe or limit the number of times a review can be modified.)

// get controllers
// getting all dishes

const getAllDishes = async (req, res) => {
  try {
    const dishes = await Dishes.find();
    res.json(dishes);
  } catch (err) {
    res.status(422).json({ message: 'The dish name is required' });
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

// getting spesific dish by its id

const getDishById = async (req, res) => {
  const { id } = req.params;

  try {
    const dish = await Dishes.findById(id);

    if (!dish) {
      res
        .status(404)
        .json({ message: 'The dish you are looking for was not found' });
    } else {
      res.json(dish);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'An error occured while fetching the dish' });
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

module.exports = {
  getAllDishes,
  filterDishes,
  getDishById,
  fetchAllDishImages,
};
