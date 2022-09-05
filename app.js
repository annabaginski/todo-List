const { urlencoded, json } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-Parser");
const mongoose = require("mongoose");
const date = require(__dirname + '/date.js');

app.set('view engine', 'ejs');

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// SET UP DATABASE

require('dotenv').config();

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'TodoListDB';

mongoose.connect(dbConnectionStr + 'TodoListDB', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
    console.log(`Connected to ${dbName} Database`)
    })
    .catch(err => {
    console.log("Database error: " + err);
    })

const itemsSchema = {
    name : String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todoList!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);

//  GET METHODS

app.get("/", function(req,res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length == 0){
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log("Error code: " + err);
                }else {
                    console.log("Success");
                }
            })
            res.redirect('/');
        } else {
        res.render("list", {listTitle: "Today", newListItems: foundItems})
}});

})

//POST METHODS

app.post("/", function(req,res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    console.log(listName, "listname")

    const item = new Item({
        name: itemName
    })

    // if (listName == "Today"){
    //     console.log('WOowoo');
    //     item.save();
    //     console.log('weewee');

    // }
    // else {
    //     List.findOne({name: listName}, function (err, foundList) {
    //         if (err) {
    //             console.log("Error:" + err);
    //         }else {
    //         foundList.items.push(item);
    //         foundList.save();
    //         res.redirect('/' + listName)
    //         }
    //     })
    // }
    item.save();
    res.redirect('/');
})

app.post('/delete', function (req,res) {
    const checkedItemId = req.body.checkbox;
    console.log("Checked item: " + checkedItemId);

    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (err){
            console.log(err, 'help me');
        }else {
            console.log("deleted")
            res.redirect('/');
        }
    })
})

// Other Lists 

// app.get('/:listName', function(req,res) {
//     const customListName = req.params.listName;
//     console.log("Custom list name: " + customListName)

//     List.findOne({name: customListName}, function(err, foundList) {
//         if (!err){
//             if (foundList){
//                 res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
//             } else {
//                 const list = new List({
//                     name: customListName,
//                     items: defaultItems
//                 })
            
//                 list.save();
//                 res.redirect('/' + customListName);
//             }    
//         }
//     })
// })

// app.post('/work', function (req,res) {
//     let item = req.body.newItem;

//     workItems.push(item);
//     res.redirect('/work');
// })


app.listen(3000, function() {
    console.log("Server is running on port 3000")
})