const healthcheck = (req, res) => {
  res.status(200).send('API is up and running');
};

module.exports = {
  healthcheck
};