var express = require( 'express' ),
    mongoose = require( 'mongoose' ), //MongoDB integration
    multer = require('multer'),
    done = false;

var app = express();

app.use('/', express.static(__dirname + "/"));


/*Configure the multer.*/
app.use(multer({
  dest: './uploads/',
  limits: {
    fieldNameSize: 100,
    files: 2,
    fields: 5
  },
  rename: function (fieldname, filename) {
    return filename + Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
    done = true;
  }
}));


app.post('/api/photo',function(req,res){
  if(done == true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});


/*Run the server.*/
app.listen(3000,function(){
  console.log("Working on port 3000");
});