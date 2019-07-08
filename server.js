const express = require('express');
const app = express();
const layouts = require('express-ejs-layouts');
// TODO: remove fs and use sequelize instead
const db = require('./models');
const moment = require('moment');
const port = 3000;
const methodOverride = require('method-override');


app.set('view engine', 'ejs');
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.get('/', function(req, res){
    res.render('index')
});

// TODO: remove fs and use sequelize functions
// Get /dinosaurs- index route - gets ALLLL dinos
app.get('/dinosaurs', function(req, res){
    db.dinosaur.findAll().then(function(dinos){
        //res.json(dinos);
        res.render('dinos/index.ejs', {dinosaurs: dinos});
    });
});

// Get /dinosaurs/new - serve up our New dino form
//this route is goood
app.get('/dinosaurs/new', function(req,res){
    res.render('dinos/new');
});


// get dinosaur/edit - serve up our dino edit
app.get('/dinosaurs/:id/edit', function(req,res){
    // let dinosaurs = fs.readFileSync('./dinosaurs.json');
    // let dinoData = JSON.parse(dinosaurs);
    // let id = parseInt(req.params.id);
    db.dinosaur.findByPk(parseInt(req.params.id))
    .then(function(dino){
        res.render('dinos/edit', {dinosaur: dino)};
    });

});

app.put('/dinosaurs/:id', function(req, res){
    db.dinosaur.update({
        name: req.body.dinosaurName,
        type: req.body.dinosaurType
    },{
        where: {id: parseInt(req.params.id)}
    }).then(function(dino){
        res.redirect('/dinosaurs/'+ req.params.id);
        
    })
    // let dinosaurs = fs.readFileSync('./dinosaurs.json');
    // let dinoData = JSON.parse(dinosaurs);
    // var id = parseInt(req.params.id);
    // dinoData[id].name = req.body.dinosaurName;
    // dinoData[id].type = req.body.dinosaurType;
    // fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));
})

// GET /dinosaurs/:id - show route- gets ONE dino
app.get('/dinosaurs/:id', function(req,res){
    // var dinosaurs = fs.readFileSync('./dinosaurs.json');
    // var dinoData = JSON.parse(dinosaurs);
    // var id = parseInt(req.params.id);
    db.dinosaur.findByPk(parseInt(req.params.id))
    .then(function(dino){
        res.render('dinos/show', {dinosaur: dino});
    });
});

// Post /dinosaurs
app.post('/dinosaurs', function(req, res){
    // read in our JSON file
    // var dinosaurs = fs.readFileSync('./dinosaurs.json');
    // convert it to an array
    // var dinoData = JSON.parse(dinosaurs);
    //push our new data into the array
    var newDino = {
        type: req.body.dinosaurType,
        name: req.body.dinosaurName
    }
    // dinoData.push(newDino);
    //write the array back to the file
    // fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));
    db.dinosaur.save(newDino).then(function(dino){
        res.redirect('/dinosaurs');

    });
});

app.delete('/dinosaurs/:id', function(req, res){
    // //read the data from the file
    // var dinosaurs = fs.readFileSync('./dinosaurs.json');
    // // parse the data into an object
    // var dinoData = JSON.parse(dinosaurs);
    // //splice out the item at the specified index
    // var id = parseInt(req.params.id);
    // dinoData.splice(id, 1);
    // // stringify the data
    // var dinoString = JSON.stringify(dinoData);
    // //write the object back to the file
    // fs.writeFileSync('./dinosaurs.json', dinoString);
    db.dinosaur.destroy({
        where: {id: parseInt(req.params.id)}
    }).then(function(data){
        res.redirect('/dinosaurs');
    });
});


app.listen(port, function(){
    console.log('😈 We are listening on port: ' + port)
});