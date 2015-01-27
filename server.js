// Module dependencies.
var os = require('os');
var express = require( 'express' ), //Web framework
    bodyParser = require('body-parser'), //Parser for reading request body
    //path = require( 'path' ), //Utilities for dealing with file paths
    mongoose = require( 'mongoose' ), //MongoDB integration
    multer = require('multer'),
    done = false;

//Create server
var app = express();
app.use('/', express.static(__dirname + "/"));
app.use(bodyParser.json());

//Start server
var port = 4711;

//Connect to database
mongoose.connect( 'mongodb://localhost/library_database' );

//Schemas
var Keywords = new mongoose.Schema({
  keyword: String
});

//Schemas
var Book = new mongoose.Schema({
  coverImage: String,
  title: String,
  author: String,
  releaseDate: Date,
  keywords: [ Keywords ]
});


//Models
var BookModel = mongoose.model( 'Book', Book );


// Routes
app.get( '/api', function( request, response ) {
  response.send( 'Library API is running' );
});


// Configure server
app.configure( function() {
  //checks request.body for HTTP method overrides
  app.use( express.methodOverride() );

  //perform route lookup based on url and HTTP method
  app.use( app.router );

  //Show all errors in development
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
});


//Get a list of all books
app.get( '/api/books', function( request, response ) {
  return BookModel.find( function( err, books ) {
    if( !err ) {
      return response.send( books );
    } else {
      return console.log( err );
    }
  });
});


//Get a single book by id
app.get( '/api/books/:id', function( request, response ) {
  return BookModel.findById( request.params.id, function( err, book ) {
    if( !err ) {
      return response.send( book );
    } else {
      return console.log( err );
    }
  });
});


//Insert a new book
app.post( '/api/books', function( request, response ) {
  var book = new BookModel({
    coverImage : uploadedPath,
    title: request.body.title,
    author: request.body.author,
    releaseDate: request.body.releaseDate,
    keywords: request.body.keywords       // NEW
  });

  return book.save( function( err ) {
    if( !err ) {
      console.log( 'created' );
      return response.send( book );
    } else {
      console.log( err );
    }
  });
});


//Update a book
app.put( '/api/books/:id', function( request, response ) {
  console.log( 'Updating book ' + request.body.title );
  return BookModel.findById( request.params.id, function( err, book ) {
    book.title = request.body.title;
    book.author = request.body.author;
    book.releaseDate = request.body.releaseDate;
    book.keywords = request.body.keywords;

    return book.save( function( err ) {
      if( !err ) {
        console.log( 'book updated' );
        return response.send( book );
      } else {
        console.log( err );
      }
    });
  });
});


//Delete a book
app.delete( '/api/books/:id', function( request, response ) {
  console.log( 'Deleting book with id: ' + request.params.id );
  return BookModel.findById( request.params.id, function( err, book ) {
    return book.remove( function( err ) {
      if( !err ) {
        console.log( 'Book removed' );
        return response.send( '' );
      } else {
        console.log( err );
      }
    });
  });
});


app.listen( port, function() {
  console.log(os.hostname(), 'Express server listening on port %d in %s mode', port, app.settings.env );
});


var upload = express();
var uploadedPath = '';

//Configure multer
upload.use(multer({
  dest: "./uploads/",
  rename: function (fieldname, filename) {
    return Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
    uploadedPath = file.path;
    done = true;
  }
}));


upload.post('/api/photo',function(request,response){
  if(done == true){
    console.log(request.files);
    response.json(uploadedPath);
  }
});


upload.get('/api/photo',function(request, response){
  return response.send(uploadedPath);
});

/*Run the server.*/
upload.listen(3000,function(){
  console.log("Working on port 3000");
});