const mongoose = require('mongoose');
const Orders = require('../models/orders');

// CREATE - Create a new order
const createOrder = async (req, res) => {
    try {
      const { user_id, dish_id, quantity} = req.body;
  
      if (!user_id || !dish_id || !quantity) {
        return res.status(400).json({ error: 'Please fill all the required fields' });
      }
  
      const newOrder = new Orders({
        user_id,
        dish_id,
        quantity,
      });
  
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };

// READ - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// READ - Get a single order by order_id
const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Orders.findById(order_id).populate('user_id');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE - Update an existing order
const updateOrder = async (req, res) => {
    try {
      const { order_id } = req.params;
      const { user_id, dish_id, quantity, orderStatus} = req.body;
      
      const updatedOrder = await Orders.findByIdAndUpdate(
        order_id,
        {
          user_id,
          dish_id,
          quantity,
          orderStatus,
        },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };

// DELETE - Delete an order by order_id
const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const deletedOrder = await Orders.findByIdAndDelete(order_id);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};