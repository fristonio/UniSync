var http=require('http');
var events=require('events');
var express=require('express');
var fs=require('fs');
var eventEmitter = new events.EventEmitter();
//var bodyParser = require('body-parser');//will be required if we do form data send receiving through express
var userCount=0;  //total no of user connected to the room at present
var users=[]; //total users connected to the server at the moment 
//var nowplay={'link':'','time':Date.now(),'curtime':0}; //data of the video being played at the current moment
var app=express();
var roomfound=false;
var privaterooms=1;


//variables for chat.
var userdata=[{
	'uid':'0',
	'uname':'admin'
}];


var k={	'id':'',
		'name':'',
		'userCount':0, 
		'nowplay':{'link':'','time':Date.now(),'curtime':0} , 
		'users':[] , 
		'playing':false 
	};

var rooms={
	'public':{	'id':'public',
				'name':'Public',
				'userCount':0, 
				'nowplay':{'link':'','time':Date.now(),'curtime':0} , 
				'users':[{'uid':'','uname':''}] , 
				'playing':false 
			},

	'private':[{'id':'00',
				'name':'room00',
				'userCount':0, 
				'nowplay':{'link':'','time':Date.now(),'curtime':0} , 
				'users':[{'uid':'','uname':''}] , 
				'playing':false
				 }]
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

function getrooms(){
	var roomlist=[];
	for(var i=0;i<rooms.private.length;i++){
			var g={'rname':rooms.private[i].name,'rid':rooms.private[i].id};
			roomlist.push(g);
		}
	return roomlist;
}

var io = require('socket.io')(server);
io.on('connection', function(client){
	users.push(client.id);
	userCount+=1;
	console.log('No of user connected to the server are   :  '+userCount);
	client.emit('enterUser');


	//for the chat 
		//checking for existence of username
		client.on('setUsername',function(data){
			console.log(data);
			var ctr=0;
			var proomno;
			console.log('set username in progress');
			for(var i=0;i<rooms.private.length;i++)
			{	console.log(rooms.private[i].id);
				if(rooms.private[i].id==data.prid)
				{
					proomno=i;
					for(var j=0;j<rooms.private[i].users.length;j++)
					{
						if(rooms.private[i].users[j].uname==data.name)
							{ctr=1;break}
					}
					if(ctr==1) break;
				
				}
			}	
				console.log(ctr);

			if(ctr==1)
			{
				console.log('user name already exists');
				client.emit('userExists',function(){});
			}
			else
				{
					for(var i=0;i<rooms.private.length;i++)
					{
						if(rooms.private[i].id==data.prid)
						{
						rooms.private[i].users.push({'uid':client.id,'uname':data.name});	
						client.emit('setUsernameSuc');
						}
					}
				}

			client.emit('displayCurrUser',{'prid':client.id,'name':data.name});

		});

		client.on('displayMessage',function(data){
			for(var i=0;i<rooms.private.length;i++)
			{
				if(data.roomid==rooms.private[i].id)
				{
					for(var j=0;j<rooms.private[i].users.length;j++)
					{
						console.log("sending data for room manipulation");
						io.to(rooms.private[i].users[j].uid).emit('domMan',{'curruser':data.curruser,'msg':data.msg,'roomid':data.roomid});
					}
				}
			}

		});


	client.on('room-search',function(){
		var roomlist=getrooms();
		client.emit('roomdata',roomlist);
		console.log(roomlist);
	});

	client.on('room-select',function(data){
		console.log(data);
		for(var i=0;i<rooms.private.length;i++){
			if(rooms.private[i].id==data){
				console.log('Room Found in the database ');
				//rooms.private[i].users.push(client.id);
				client.emit("roompagenav",rooms.private[i]);
				console.log(rooms.private[i].playing);
				if(rooms.private[i].playing==true){
					var t=(Date.now()-rooms.private[i].nowplay.time)/1000;
					t=parseInt(t)+1;
					rooms.private[i].nowplay.curtime=t;
					for(var j=0;j<rooms.private[i].users.length;j++){
						io.to(rooms.private[i].users[j].uid).emit('playnow',rooms.private[i].nowplay);
					}
				}
				break;
			}
		}

	});
	


	client.on('dataemit', function(data){
		console.log(data);
		if (data.roomid=='public') {
			rooms.public.nowplay.link=data.link;
			rooms.public.nowplay.time=data.time;
			console.log("Video is being played in public :P");
			rooms.public.playing=true;
		}
		else{
			for(var i=0;i<rooms.private.length;i++){
				if(rooms.private[i].id==data.roomid){
					console.log('Room Found in the database ');
					rooms.private[i].nowplay.link=data.link;
			  		rooms.private[i].nowplay.time=data.time;
			  		console.log("currently playing video in the room "+rooms.private[i].name+"is  :  "+rooms.private[i].nowplay.link);
			  		rooms.private[i].playing=true;
					break;
				}
			}
		}
  	});

  	client.on('sync', function(data){
  		if(data=='public'){
  			console.log('Syncing the public room');
  			var t=(Date.now()-rooms.public.nowplay.time)/1000;
			t=parseInt(t)+1;
			rooms.public.nowplay.curtime=t;
			for(var j=0;j<rooms.public.users.length;j++){
				io.to(rooms.public.users[j].uid).emit('playnow',rooms.public.nowplay);
			}
  		}
  		else{
	  		for(var i=0;i<rooms.private.length;i++){
				if(rooms.private[i].id==data){
					console.log('Syncing the room');
					var t=(Date.now()-rooms.private[i].nowplay.time)/1000;
					t=parseInt(t)+1;
					rooms.private[i].nowplay.curtime=t;
					for(var j=0;j<rooms.private[i].users.length;j++){
						io.to(rooms.private[i].users[j].uid).emit('playnow',rooms.private[i].nowplay);
					}
					break;
				}
			}
		}
  	});

  	client.on('create-room',function(data){
  		k.id=privaterooms;
  		privaterooms+=1;
  		k.name=data;
  		k.nowplay.time=Date.now();
  		rooms.private.push(k);
  		console.log("A room has been created and the room details are : ");
  		console.log(rooms.private);
  		client.emit('room-created',data);
  	});

  	client.on('joinpublic',function(){
  		rooms.public.users.push(client.id);
  		client.emit('publicdata',rooms.public);
  		if(rooms.public.playing==true){
  			var t=(Date.now()-rooms.public.nowplay.time)/1000;
			t=parseInt(t)+1;
			rooms.public.nowplay.curtime=t;
			for(var j=0;j<rooms.public.users.length;j++){
				io.to(rooms.public.users[j]).emit('playnow',rooms.public.nowplay);
			}
  		}
  	});

  	client.on('disconnect', function(){
  		console.log('user disconnected  :  '+client.id);
  		userCount-=1;
  		console.log('Current users in the server are  :  '+userCount);
  		var index=users.indexOf(client.id);
  		users.splice(index,1);
  	});
  	console.log(users);
});


server.listen(3000);
console.log('Server running at 3000 port in the localhost');