var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var file = "./server/db/cafe.db";
var db = new sqlite3.Database(file);
var exists = fs.existsSync(file);

var _ = require('underscore');
var data = require('./db');

if(!exists) {
	console.log("Creating DB file.");
	db.serialize(function(){
		db.run("CREATE TABLE cafes \
			(ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
			 name VARCHAR(15), \
			 address VARCHAR(25), \
			 phone VARCHAR(14) \
			)");

		db.run("CREATE TABLE menu \
			(ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
				item VARCHAR(15), \
				rating REAL(1), \
		    cafeID INTEGER(10), \
		    FOREIGN KEY(cafeID) REFERENCES cafes(ID) \
      )");

    _.each(data, function(cafe){
      addCafe(cafe);
      cafe.menu.forEach(function(menu){
        var _item = {
          name: cafe.name.toLowerCase(),
          menuItem: {
            name: menu.item,
            rating: menu.rating
          }
        }
        addCafeMenuItem(_item);
      });
    })

	});
}


function DBQuery(menuItemObj){
	var name = menuItemObj.name;
	db.get("SELECT ID FROM cafes WHERE name = ?", [sqliteEscape(name)], function(err, row){});
}

// takes a string
function addCafe(cafeObj, cb){
  db.run("INSERT INTO cafes(name,address,phone) VALUES(?,?,?)", [sqliteEscape(cafeObj.name.toLowerCase()), sqliteEscape(cafeObj.address), sqliteEscape(cafeObj.phone)], function(err){
		  if(err){
		  	console.log('error inside addcafe: ', err);
		  }
		  if(cb){
  			 cb();
  		}
	});
};

function addCafeMenuItem(menuItemObj, cb){
	var cafeName = sqliteEscape(menuItemObj.name);
	var menuItemName = sqliteEscape(menuItemObj.menuItem.name);
	var rating = menuItemObj.menuItem.rating;
  db.get("SELECT ID FROM cafes WHERE name = ?", [cafeName], function(err, row){
  	db.run("INSERT INTO menu(item, rating, cafeID) VALUES(?, ?, ?)", [menuItemName, rating, row.ID], function(err){
  		if(cb){
  			 cb();
  		}
  	});
  });

};

function doesCafeExist(cafeName, cb){
	db.get("SELECT name FROM cafes WHERE name = ?", [sqliteEscape(cafeName)], function(err, row){
		if(cb){
      cb(!!(row));
		}
	});
};

function doesCafeMenuItemExist(menuItemObj, cb){

	db.get("SELECT ID FROM cafes WHERE name = ?", [sqliteEscape(menuItemObj.name)], function(err, row){
		  db.get("SELECT item FROM menu WHERE item = ? AND cafeID = ?", [menuItemObj.menuItem.name, row.ID], function(err, row){
		  	if(cb){
		  		cb(!!(row));
		  	}
		  });
	})
};

function getCafe(cafeName, cb){
	db.get("SELECT * FROM cafes WHERE name = ?", [sqliteEscape(cafeName)], function(err, row){
    var cafe = row;
		var menu = [];

		db.each("SELECT * FROM menu WHERE cafeID = ?", [cafe.ID], function(err, row){
			menu.push(row);
		}, function(err, numberOfRetrievedRows){
			var cafeObj = {};
			cafeObj.name = cafe.name;
      cafeObj.phone = cafe.phone;
      cafeObj.address = cafe.address;
			cafeObj.menu = menu;
			cb(cafeObj);
		});
	});
};

	// TODO: add this to mocha/chai
  // testing that functions work - later for mocha/chai
  // var testObj = {
  // 	name: "testingThis",
  // 	menuItem: {
  // 		name: "coffee",
  // 		rating: 5
  // 	}
  // };
  // db.addCafe("testingThis", function(){
  // 	db.addCafeMenuItem(testObj, function(){
  // 		db.getCafe("testingThis", function(row){
  // 			console.log("row", row);
  // 		});
  // 	});
  // });


module.exports = {
	db: db,
	DBQuery: DBQuery,
	addCafe: addCafe,
	addCafeMenuItem: addCafeMenuItem,
	doesCafeExist: doesCafeExist,
	doesCafeMenuItemExist: doesCafeMenuItemExist,
	getCafe: getCafe
}

//make strings friendly. Nothing should touch the DB without going through
//here first
function sqliteEscape (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}
