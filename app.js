const { urlencoded, json } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-Parser")
const date = require(__dirname + '/date.js');

app.set('view engine', 'ejs');

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let items = [];
let workItems = [];


//  Dated to Today List
app.get("/", function(req,res) {
    let day = date();

    res.render("list", {listTitle: day, newListItems: items});

})

app.post("/", function(req,res) {
    let item = req.body.newItem;
    if (req.body.list == 'Work'){
        workItems.push(item);
        res.redirect('/work');
    }else {
      items.push(item);
      res.redirect('/');  
    }

    
})

// Work List 

app.get('/work', function(req,res) {
    res.render('list', {listTitle: 'Work List', newListItems: items})
})

// app.post('/work', function (req,res) {
//     let item = req.body.newItem;

//     workItems.push(item);
//     res.redirect('/work');
// })


app.listen(3000, function() {
    console.log("Server is running on port 3000")
})