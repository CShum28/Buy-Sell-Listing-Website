const db = require('../connection');

const getUsers = () => {
  return database.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};



module.exports = { getUsers };
