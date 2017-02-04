var http=require('http');
var event=require('events');
var express=require('express');
var fs=require('fs');
//var bodyParser = require('body-parser');//will be required if we do form data send receiving through express
var playing=false; //wheather a video is being played or not
var userCount=0;  // no of user connected to the room at present
var users=[]; //users connected to the server at the moment 
var nowplay={'link':'','time':Date.now(),'curtime':0}; //data of the video being played at the current moment
var app=express();

var rooms={
	'public':{'name':'Public','userCount':0, 'nowplay':{'link':'','time':Date.now(),'curtime':0} , },
	'private':[]
};
//app.use(bodyParser.json());// to work with the get and post request form data with the help of the express library in nodejs
//app.use(bodyParser.urlencoded({ extended: true }));


var server=http.createServer(app,function(req,res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
  	res.end('Server fine and running');
});


app.get('/', function(req, res) {
           // Send out the index.html
           res.sendFile(__dirname+'/index.html');
       });
app.get('/style.css', function(req, res) {
           // Send out the index.html
           res.sendFile(__dirname+'/style.css');
       });
app.get('/script.js', function(req, res) {
           // Send out the index.html
           res.sendFile(__dirname+'/script.js');
       });


/*app.post('/', function(req,res){
			console.log('User sent the link  :  '+req.body.link);
			res.end();
});*/


var io = require('socket.io')(server);
io.on('connection', function(client){
	users.push(client.id);
	userCount+=1;
	if(playing==true){
		var t=(Date.now()-nowplay.time)/1000;
		t=parseInt(t)+1;
		nowplay.curtime=t;
		io.emit('playnow',nowplay);
	}
	console.log('No of user connected to the server are   :  '+userCount);


  	client.on('dataemit', function(data){
  		//if (playing==false) {
  		console.log('Link given by the user is  :  '+data.link);
  		//console.log('Unique timestamp :  '+data.time);
  		//console.log(data);
  		nowplay.link=data.link;
  		nowplay.time=data.time;
  		console.log("currently playing video is  :  "+nowplay.link);
  		playing=true; //}
  	});


  	client.on('disconnect', function(){
  		console.log('user disconnected  :  '+client.id);
  		userCount-=1;
  		console.log('Current users in the room are  :  '+userCount);
  		var index=users.indexOf(client.id);
  		users.splice(index,1);
  	});


  	/*client.on('getinfo',function(){
  		console.log(users);
  	});*/
  	client.on('sync', function(){
  		var t=(Date.now()-nowplay.time)/1000;
		t=parseInt(t)+1;
		nowplay.curtime=t;
		io.emit('playnow',nowplay);
  	});

  	console.log(users);
});


server.listen(3000);
console.log('Server running at 3000 port in the localhost');