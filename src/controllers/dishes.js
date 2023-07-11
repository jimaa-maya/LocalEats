const express = require('express');
const Dishes = require('../models/dishes') 
module.exports.getAllDishes = () =>{
    console.log('helo')
    return Dishes.find({});
}

