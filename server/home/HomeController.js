var db = require('../db/dbserver.js');

module.exports = {
	search: function(req, res) {
		var cafe = req.body ? req.body.cafe.name.toLowerCase() : null;
    db.doesCafeExist(cafe, function(booler){
      if(booler){
        db.getCafe(cafe, function(cafeObj){
          res.status(200).send(JSON.stringify(cafeObj));
        });
      }
      else{
        res.status(400).send("That cafe was not found.");
      }
    });
	},

  //used on POST to api/items/add
  addMenuItem: function(req, res){
    var menuItem = req.body ? req.body.menu[0].item.toLowerCase() : null;
    var rating = req.body ? req.body.menu[0].rating.toLowerCase() : null;
    var cafe = req.body ? req.body.cafe.name.toLowerCase() : null;

    db.doesCafeExist(cafe, function(booler){
      if(booler){
        db.addCafeMenuItem(req.body.cafe, function(){
          res.status(200).send('Item added succesfully.');
        });
      }
      else{
        res.status(400).send("No cafe with that name exists, can't add item");
      }
    });
  },

  addCafe: function(req, res){
    var cafe = req.body ? req.body.cafe.name.toLowerCase() : null;
    db.doesCafeExist(cafe, function(booler){
      if(booler){
        res.status(400).send('That cafe already exists.');
      }
      else{
        db.addCafe(cafe, function(){
          db.getCafe(cafe, function(cafeObj){
            res.status(200).send(JSON.stringify(cafeObj));
          });
        });
      }
    });
  }
};
