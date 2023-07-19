const axios = require('axios');

axios.post('http://localhost:3000/api/sign/reset-password', {
  userName: 'JoCarman',
  newPassword: 'newsecretpassword'
}, {
  headers: {
    Authorization: 'Bearer s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IkpvQ2FybWFuIiwiZW1haWwiOiJqb0Nhcm1hbkBleGFtcGxlLmNvbSIsImlhdCI6MTY4OTc1NTgwOSwiZXhwIjoxNjkwOTY1NDA5fQ.l8ePRmdBI3CUEM-IoFKswmDI4kLc5Fs04Yp_wxb3n50.F6W0JxspV0kTTTW4SYd0cVb7X7YGEG41yy1MN1yBLVE' // Replace {token} with the actual token value
  }
})
  .then((response) => {
    console.log('Password reset successful');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
