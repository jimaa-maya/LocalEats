const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users');


exports.getUser = async (req,res,next) =>{
    next()
}

exports.putUser = async (req,res,next) =>{
    next()
}

exports.addRole = async (req, res) => {
    const token = req.cookies.jwt;
    const role = req.query.role;
    if(!token){
      return res.status(401).json({message: "Unauthorized!"})
    }
    try {
      const deckodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOneAndUpdate(
        { email: deckodedToken.email },
        { role: role },
        { new: true }
      );
      res.status(201).json( user );
    } catch (err) {
      console.log(err);
    }
  };

exports.getRole = () =>{

}

exports.addAddress = async (req,res) =>{
    const token = req.cookies.jwt;
    const {apartmentNo,city,country} = req.body;
    const address = {apartmentNo,city,country};
    if(!token){
      return res.status(401).json({message: 'Unauthorized!'})
    }
    try{
      const deckodedToken = jwt.verify(token,process.env.SECRET_KEY);
      const user = await User.findOneAndUpdate(
        { email: deckodedToken.email },
        { address: address },
        { new: true }
      );
      res.status(201).json( user );
    }catch(err){
      console.log(err)
    }
  }
exports.getAddress = () =>{
    
}