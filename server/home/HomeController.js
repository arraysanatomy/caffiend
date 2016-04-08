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
    var rating = req.body ? req.body.menu[0].rating : null;
    var cafe = req.body ? req.body.cafe.name.toLowerCase() : null;

    db.doesCafeExist(cafe, function(booler){
      if(booler && menuItem && rating){
        
        var item = {
          name: cafe,
          menuItem: {
            name: menuItem,
            rating: rating
          }
        };

        db.addCafeMenuItem(item, function(){
          db.getCafe(cafe, function(cafeObj){
            res.status(200).send(cafeObj);  
          });
        });
      }
      else{
        res.status(400).send("No cafe with that name exists, can't add item");
      }
    });
  },

  addCafe: function(req, res){
    var cafe = req.body ? req.body.cafe : null;
    db.doesCafeExist(cafe.name.toLowerCase(), function(booler){
      if(booler){
        res.status(400).send('That cafe already exists.');
      }
      else{
        db.addCafe(cafe, function(){
          db.getCafe(cafe.name.toLowerCase(), function(cafeObj){
            res.status(200).send(JSON.stringify(cafeObj));
          });
        });
      }
    });
  }
};
