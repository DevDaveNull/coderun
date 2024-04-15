module.exports = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  else return res.status(403).json("Вы не прошли аутентификацию");
};
