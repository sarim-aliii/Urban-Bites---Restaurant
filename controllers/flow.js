module.exports.home = (req, res) => {
  res.render("../views/home.ejs");
};

module.exports.index = (req, res) => {
  res.render("../views/index.ejs");
};

module.exports.menu = (req, res) => {
  res.render("../views/menu.ejs");
};

module.exports.about = (req, res) => {
  res.render("../views/about.ejs");
};