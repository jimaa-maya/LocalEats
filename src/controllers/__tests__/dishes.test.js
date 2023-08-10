/* eslint-disable no-underscore-dangle */
/* eslint-disable node/no-unsupported-features/es-syntax */
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = require('../../app');
const {
  uploadImage,
  updateImage,
  deleteImage,
} = require('../../services/firebaseConfig');
const {
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
} = require('../dishes');
const Dishes = require('../../models/dishes');
const Users = require('../../models/users');

app.use(express.json());

// mocking the Dishes model methods
jest.mock('../../models/dishes');

// preparing a mock data
const mockDishes = [
  {
    _id: '1',
    dishName: 'Dish 1',
    description: 'Description 1',
  },
  {
    _id: '2',
    dishName: 'Dish 2',
    description: 'Description 2',
  },
];

describe('Dishes Controller', () => {
  let server;

  beforeEach(() => {
    server = app.listen();
  });

  afterEach(async () => {
    await server.close();
    jest.resetAllMocks(); // resetting mock function calls
  });

  describe('getAllDishes', () => {
    it('should get all dishes successfully', async () => {
      // mocking dishes.find
      Dishes.find.mockResolvedValue(mockDishes);
      // sending get req to the app
      const res = await request(server).get('/api/dishes');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockDishes);
    });
  });

  describe('getDishById', () => {
    it('should return the dish with the provided id', async () => {
      const mockDish = {
        _id: '1',
        dishName: 'Dish 1',
        description: 'Description 1',
      };
      Dishes.findById.mockResolvedValue(mockDish);
      // creating a mock req and res obj
      const req = { params: { id: '1' } };
      const res = { json: jest.fn() };
      await getDishById(req, res);
      expect(Dishes.findById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockDish);
    });
  });
});

describe('filterDishes', () => {
  it('should return filtered dishes based on dishType and preference', async () => {
    // preparing a mock request and filtered dish data
    const req = { body: { dishType: 'Type 1', preferences: 'Preference 1' } };
    const mockFilteredDishes = [
      {
        _id: '1',
        dishName: 'Dish 1',
        description: 'Description 1',
        dishType: ['Type 1'],
        preferences: ['Preference 1'],
      },
      {
        _id: '2',
        dishName: 'Dish 2',
        description: 'Description 2',
        dishType: ['Type 1'],
        preferences: ['Preference 2'],
      },
    ];
    Dishes.find.mockResolvedValue(mockFilteredDishes);
    // created a mock response obj
    const res = { json: jest.fn() };
    await filterDishes(req, res);
    // checking if dishes.find was called with expected location criteria
    expect(Dishes.find).toHaveBeenCalledWith({
      dishType: { $in: ['Type 1'] },
      preferences: { $in: ['Preference 1'] },
    });
    expect(res.json).toHaveBeenCalledWith(mockFilteredDishes);
  });
});

describe('getDishesByLocation', () => {
  it('should return dishes matching the provided city and country', async () => {
    // mocking res and mocked data
    const req = { query: { city: 'City 1', country: 'Country 1' } };
    const mockDishesByLocation = [
      {
        _id: '1',
        dishName: 'Dish 1',
        description: 'Description 1',
        user_id: { address: { city: 'City 1', country: 'Country 1' } },
      },
      {
        _id: '2',
        dishName: 'Dish 2',
        description: 'Description 2',
        user_id: { address: { city: 'City 2', country: 'Country 1' } },
      },
    ];
    Dishes.find.mockResolvedValue(mockDishesByLocation);
    const res = { json: jest.fn() };
    await getDishesByLocation(req, res);
    expect(Dishes.find).toHaveBeenCalledWith({
      'user_id.address.city': 'City 1',
      'user_id.address.country': 'Country 1',
    });
    expect(res.json).toHaveBeenCalledWith(mockDishesByLocation);
  });
});

describe('fetchAllDishImages', () => {
  it('should return all dish images with base64 encoding', async () => {
    const mockDishesImages = [
      { _id: '1', image_url: Buffer.from('Image 1') },
      { _id: '2', image_url: Buffer.from('Image 2') },
    ];
    Dishes.find.mockResolvedValue(mockDishesImages);
    const res = { json: jest.fn() };
    await fetchAllDishImages({}, res);

    // generating expected response with base64-encoded image urls
    const expectedResponse = mockDishesImages
      .map((dish) => ({
        _id: dish._id,
        imageUrl: `data:image/jpeg;base64, ${dish.image_url
          .toString('base64')
          .trim()}`,
      }))
      .filter((dish) => dish.imageUrl);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining(expectedResponse)
    );
  });
});

describe('fetchDishImage', () => {
  it('should return the base64 encoded image for the given dishId', async () => {
    const mockDish = { _id: '1', image_url: Buffer.from('Image 1') };
    Dishes.findById.mockResolvedValue(mockDish);
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const req = { params: { _id: '1' } };

    await fetchDishImage(req, res);

    // generating expected response with base64-encoded image url
    const expectedResponse = {
      _id: '1',
      imageUrl: 'data:image/jpeg;base64,SW1hZ2UgMQ==',
    };
    expect(Dishes.findById).toHaveBeenCalledWith('1', 'image_url');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });
});

describe('createDish', () => {
  it('should create a new dish successfully', async () => {
    const mockUser = { _id: 'user-id' };
    const req = {
      body: {
        dishName: 'New Dish',
        description: 'Description',
        price: 10,
        dishType: 'Main Course',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.spyOn(Users, 'findOne').mockResolvedValue(mockUser); // mocking the findOne function

    Dishes.prototype.save.mockResolvedValueOnce({}); // mocking the saved method
    await createDish(req, res);

    expect(Users.findOne).toHaveBeenCalledTimes(1);
    expect(Dishes.prototype.save).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dish created successfully',
      dish: expect.any(Object),
    });
  });
});

describe('removeDish', () => {
  it('should remove the dish with the provided dishId', async () => {
    const mockDish = {
      _id: '1',
      dishName: 'Dish 1',
      description: 'Description 1',
    };
    const req = { params: { _id: '1' } };
    const res = { json: jest.fn() };
    Dishes.findByIdAndRemove.mockResolvedValueOnce(mockDish);
    await removeDish(req, res);
    expect(Dishes.findByIdAndRemove).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(mockDish);
  });
});

/* 
------ WILL BE CHECKED AGAIN -------
// Updating dish test
describe('updateDish', () => {
  beforeEach(() => {
    // Clear any previous mock calls from Dishes.findById
    Dishes.findById.mockClear();
  });
  it('should update a dish successfully', async () => {
    const mockDish = new Dishes({
      _id: new mongoose.Types.ObjectId(),
      dishName: 'Dish 1',
      description: 'Description 1',
      price: 5,
      dishType: 'Italian',
    });
    jest.spyOn(Dishes, 'findById').mockResolvedValueOnce(mockDish);
    jest.spyOn(mockDish, 'save').mockResolvedValueOnce(mockDish);
    const req = {
      params: { _id: mockDish._id.toString() },
      body: {
        dishName: 'Updated Dish',
        description: 'Updated Description',
        price: 15,
        dishType: 'Main Course',
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await updateDish(req, res);
    expect(mockDish.dishName).toBe('Updated Dish');
    expect(mockDish.description).toBe('Updated Description');
    expect(mockDish.price).toBe(15);
    expect(mockDish.dishType).toBe('Main Course');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dish updated successfully',
      dish: expect.any(Object),
    });
  });
});
// Updating Dish Image Test
describe('updateDishImage', () => {
  it('should update the dish image successfully', async () => {
    const mockDish = new Dishes({
      _id: new mongoose.Types.ObjectId(),
      image_url: 'https://example.com/old-image.jpg',
    });
    const mockFile = {
      buffer: Buffer.from('New Image'),
      mimetype: 'image/jpeg',
    };
    const req = {
      params: { _id: mockDish._id.toString() },
      file: mockFile,
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.spyOn(Dishes, 'findById').mockResolvedValueOnce(mockDish);
    jest.spyOn(mockDish, 'save').mockResolvedValueOnce(mockDish);
    jest.spyOn(deleteImage, 'mockResolvedValueOnce');
    jest.spyOn(updateImage, 'mockResolvedValueOnce');
    await updateDishImage(req, res);
    expect(deleteImage).toHaveBeenCalledWith(mockDish.image_url);
    expect(updateImage).toHaveBeenCalledWith(
      mockFile.buffer,
      mockFile.mimetype,
      mockDish.image_url,
      expect.any(String)
    );
    expect(mockDish.image_url).toBe('updated_image_url');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dish image updated successfully',
      dish: expect.any(Object),
    });
  });
});
// Adding review Test
describe('addReview', () => {
  it('should add a new review to the dish successfully', async () => {
    const mockDish = new Dishes({
      _id: mongoose.Types.ObjectId(),
      dishName: 'Dish 1',
      description: 'Description 1',
      price: 5,
      dishType: 'Italian',
      review: [],
      rating: 0,
    });
    const req = {
      params: { _id: mockDish._id.toString() },
      user_id: mongoose.Types.ObjectId(),
      body: {
        review: 'Great dish!',
        rating: 5,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Dishes.findById.mockResolvedValueOnce(mockDish);
    Dishes.create = jest.fn().mockResolvedValue(mockDish);
    await addReview(req, res);
    expect(mockDish.review).toHaveLength(1);
    expect(mockDish.review[0].user_id).toEqual(req.user_id);
    expect(mockDish.rating).toBe(5);
    expect(Dishes.create).toHaveBeenCalled(mockDish);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Review added successfully',
    });
  });
});
// Updating review Test
describe('updateReview', () => {
  it('should update a review of the dish successfully', async () => {
    const mockDish = new Dishes({
      _id: mongoose.Types.ObjectId(),
      dishName: 'Dish 1',
      description: 'Description 1',
      price: 5,
      dishType: 'Italian',
      review: [
        {
          user_id: mongoose.Types.ObjectId(),
          content: 'Good dish',
          rating: 4,
          updatedAt: new Date(),
        },
      ],
      rating: 4,
    });
    const req = {
      params: { _id: mockDish._id.toString() },
      user_id: mockDish.review[0].user_id.toString(),
      body: {
        review: 'Updated review',
        rating: 3,
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Dishes.findById.mockResolvedValueOnce(mockDish);
    mockDish.save = jest.fn().mockResolvedValue(mockDish);
    await updateReview(req, res);
    expect(mockDish.review[0].content).toBe('Updated review');
    expect(mockDish.review[0].rating).toBe(3);
    expect(mockDish.rating).toBe(3);
    expect(mockDish.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Review updated successfully',
    });
  });
});
*/
