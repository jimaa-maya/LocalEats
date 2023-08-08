const request = require("supertest");
const expect = require("chai").expect;
const app = require("../../app"); 

describe("User Authentication API", () => {
  it("should sign up a new user successfully", async () => {
    const newUser = {
      userName: "test-user",
      email: "testuser@test.com",
      password: "testPassword123",
      address: {
        apartmentNo: 357,
        streetNo: 125,
        buildingNo: 258,
        city: "new City",
        country: "new Country"
      },
      phoneNumber: 1234567898,
      role: "user",
    };

    const response = await request(app)
      .post("/api/sign/signup")
      .send(newUser)
      .expect(200);

    // Assertions for successful signup
    expect(response.body.message).to.equal("Sign-up successful");
  });

  it("should not sign up a new user if the email already exists", async () => {
    const existingUser = {
      userName: "test-user",
      email: "testuser@test.com",
      password: "testPassword123",
      address: {
        apartmentNo: 357,
        streetNo: 125,
        buildingNo: 258,
        city: "new City",
        country: "new Country"
      },
      phoneNumber: 1234567898,
      role: "user",
    };

    const response = await request(app)
      .post("/api/sign/signup")
      .send(existingUser)
      .expect(409);

    // Assertions for email already exists
    expect(response.body.message).to.equal("Email already exists");
  });

  it("should sign in a user successfully", async () => {
    const userCredentials = {
      userName: "test-user",
      password: "testPassword123",
    };

    const response = await request(app)
      .post("/api/sign/signin")
      .send(userCredentials)
      .expect(200);

    // Assertions for successful sign-in
    expect(response.body.message).to.equal("Sign-in successful");
  });

  it("should not sign in a user with invalid credentials", async () => {
    const invalidCredentials = {
      userName: "test-user",
      password: "invalidPassword",
    };

    const response = await request(app)
      .post("/api/sign/signin")
      .send(invalidCredentials)
      .expect(401);

    // Assertions for invalid credentials
    expect(response.body.message).to.equal("Invalid username or password");
  });

  describe("Sign Out API", () => {
    it("should sign out a user successfully", async () => {
      const userCredentials = {
        userName: "test-user",
        password: "testPassword123",
      };

      // Sign in to get the token
      const signInResponse = await request(app)
        .post("/api/sign/signin")
        .send(userCredentials)
        .expect(200);

        //const token = signInResponse.body.token;

      //const token = signInResponse.headers["set-cookie"][0].split(";")[0];
      const tokenCookie = signInResponse.headers["set-cookie"][0]; 
const token = tokenCookie.split(';')[0].split('=')[1]; 
console.log("token:", token);


      // Send the token in the request headers
      const response = await request(app)
        .get("/api/sign/signout")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      // Assertions for successful sign-out
      expect(response.body.message).to.equal("Sign-out successful");
    });

  });

 
  

  
    describe("Reset Password API", () => {
      it("should reset the user's password successfully", async () => {
        const userCredentials = {
          userName: "test-user",
          password: "testPassword123",
        };
  
        // Sign in to get the token
        const signInResponse = await request(app)
          .post("/api/sign/signin")
          .send(userCredentials)
          .expect(200);
  
        const tokenCookie = signInResponse.headers["set-cookie"][0]; 
        const token = tokenCookie.split(';')[0].split('=')[1]; 
  
        // Request to reset the password
        const resetPasswordData = {
          userName: "test-user",
          oldPassword: "testPassword123",
          newPassword: "newTestPassword456",
        };
  
        const response = await request(app)
          .post("/api/sign/reset-password")
          .set("Authorization", `Bearer ${token}`)
          .send(resetPasswordData)
          .expect(200);
  
        // Assertions for successful password reset
        expect(response.body.message).to.equal("Password reset successful");
      });
  
    });
  
  });
  
