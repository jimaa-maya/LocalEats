const request = require('supertest');
const app = require('../../app');

//const User = require('../../models/users');

let userId;
let userUserName;
let userEmail;
let userPassword;
let userAddress = {
  apartmentNo: Number,
  streetNo: Number,
  buildingNo: Number,
  city: String,
  country: String,
}
let userPhoneNumber;
//let userProfilePic;
let userRole;

beforeAll(async () => {
  
    userId = '64c91e14224bf98633eb9970';
    userUserName = 'Abuzaid';
    userEmail = 'abuzaid@fake.come';
    userPassword = 'Fake@123';
    userAddress = {
        apartmentNo: 1410,
        streetNo: 230,
        buildingNo: 15,
        city: 'Istanbul',
        country: 'Turkey',
    };
    userPhoneNumber = 9055443322;
    userRole = 'user'
    
});

// To do : add profilePic
describe('Users Controller - createUser', () => {
  it('should create a new user', async () => {
    const requestBody = {
      user_id: userId,
      userName : userUserName,
      email : userEmail,
      password : userPassword,
      address : userAddress,
      phoneNumber : userPhoneNumber,
      role : userRole,
    };

    const response = await request(app)
      .post('/api/users/')
      .send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user_id');
    expect(response.body.user_id).toEqual(requestBody.user_id);
    expect(response.body).toHaveProperty('userName');
    expect(response.body.user_id).toEqual(requestBody.userName);
    expect(response.body).toHaveProperty('email');
    expect(response.body.user_id).toEqual(requestBody.email);
    expect(response.body).toHaveProperty('password');
    expect(response.body.user_id).toEqual(requestBody.password);
    expect(response.body).toHaveProperty('address');
    expect(response.body.user_id).toEqual(requestBody.address);
    expect(response.body).toHaveProperty('phoneNumber');
    expect(response.body.user_id).toEqual(requestBody.phoneNumber);
    expect(response.body).toHaveProperty('role');
    expect(response.body.user_id).toEqual(requestBody.role);
  });
});

describe('Users Controller - updateUser', () => {
  it('Update user address', async () => {
    const requestBody = {
      address : {
        apartmentNo : 33,
      },
    };

    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send(requestBody);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user_id');
    expect(response.body.user_id).toEqual(userId);
    expect(response.body.address.apartmentNo).toEqual(requestBody.address.apartmentNo);
  });
});


describe('Users Controller - getAllUsers', () => {
    it('should get all user data', async () => {
      const response = await request(app).get('/api/users/');
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          address: expect.objectContaining({
            apartmentNo: 33,
          }),
        },
      ]);
    });

  });
  