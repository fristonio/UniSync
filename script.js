window.onload=function(){

	
	var socket = io();
	socket.on('enterUser',function(){
		
	});
	

	console.log(socket.id);
	socket.on('connect', function(){
	  console.log(socket.id);
	});

	var roomdata;

	document.getElementsByClassName('join')[0].onclick=function(){
		var jr=document.getElementsByClassName('join-room')[0];
		jr.style.zIndex="5";
		jr.style.display="flex";
	};

	document.getElementsByClassName("close")[0].onclick=function(){
		this.parentNode.style.display="none";
	};

	document.getElementsByClassName('privateroom')[0].onclick=function(){
		socket.emit('room-search');
	}
	socket.on('roomdata',function(data){
		document.getElementById('private-room').style.display="flex";
		console.log(data);
		for(var i=0;i<data.length;i++){
			$("#private-room").append("<h3 id='"+data[i].rid+"'>"+data[i].rname+"</h3>");
		}
	});


//private room selection 

	$('#private-room').on('click','h3',function(){
		var password=prompt("Enter the password for the room : ");
		socket.emit('pass_check',{'pass':password,'id':this.id});
	});

	socket.on('pass_verified',function(){
			var name=prompt('Enter a Username to chat');
			console.log(name);
			socket.emit('setUsername',{'prid':this.id,'name':name});
			socket.on('setUsernameSuc',function(){
			alert('username successfully created');
				});
			socket.on('userExists',function(){
			var name=prompt('Username already Exits. Enter A new one');
			socket.emit('setUsername',{'prid':this.id,'name':name});
			});
			console.log(this.id);
			$('#msgsubmitpublic').css({'display':'none'});
			socket.emit('room-select',this.id);
		});

	socket.on('displayCurrUser',function(data){

		console.log('going to display user');
		$('.curruser').text(data.name);
	});

	$('#msgsubmitprivate').click(function(){
		console.log('processing the input');
		var curruser=document.getElementsByClassName("curruser")[0].innerHTML;
		var msg=document.getElementById('message').value;
		console.log(curruser+' '+msg+' '+roomdata.id);

		socket.emit('displayMessagePri',{'curruser':curruser,'msg':msg,'roomid':roomdata.id});
		//return false;
	});
	$('#msgsubmitpublic').click(function(){
		console.log('processing the input');
		var curruser=document.getElementsByClassName("curruser")[0].innerHTML;
		var msg=document.getElementById('message').value;
		console.log(curruser+' '+msg+' '+roomdata.id);

		socket.emit('displayMessagePub',{'curruser':curruser,'msg':msg,'roomid':roomdata.id});
		//return false;
	});
		
	

	socket.on('domMan',function(data){
		console.log(data);
		added='<span style="font-weight:800">'+data.curruser+' : </span>'+'<span class="message">'+data.msg+'</span><br>';
		document.getElementById("premsg").innerHTML+=added;
	});





	socket.on('roompagenav',function(data){
		$('#navpage').css('display','none');
		$('#roompage').css('display','block');
		roomdata=data;
		$('#roompage').attr('id',roomdata.id);
		console.log(roomdata);
	});

	document.getElementsByTagName('form')[0].onsubmit=function(){
		var link=document.getElementsByTagName('input')[0].value ;
		link=link.replace('/watch?v=','/embed/');
		link=link+"?autoplay=1";
		socket.emit('dataemit',{'link': link , 'time':Date.now(),'roomid':roomdata.id});
		document.getElementById("mainvid").src=link;
		return false;
	};

	socket.on('playnow',function(data){
		t=data.curtime;
		console.log(t);
		var link=data.link+"&start="+t;
		console.log(link);
		document.getElementById("mainvid").src=link;
	});
	document.getElementsByClassName('sync-btn')[0].onclick=function(){
		socket.emit('sync',roomdata.id);
	}

//create private room on the server
	$('.create').click(function(){
		$('#createroom').css('display','flex');
		var roomname=prompt("Enter your room name  :  ");
		if(roomname!=null){
			socket.emit('create-room',roomname);
		}
	});

	socket.on('room-created',function(data){
		alert('Congo your room has been created _/\ _ with name  : '+data);
		$('#createroom').css('display','none');
	});

//public room joining
	$('.publicroom').click(function(){
		var name=prompt('Enter a Username to chat');
		console.log(name);
		socket.emit('setUsernamePub',{'prid':this.id,'name':name});
		socket.on('setUsernameSuc',function(){
		alert('username successfully created');
			});
		socket.on('userExistsPub',function(){
		var name=prompt('Username already Exits. Enter A new one');
		socket.emit('setUsernamePub',{'prid':this.id,'name':name});
		});
		$('#msgsubmitprivate').css({'display':'none'});
		socket.emit('joinpublic',name);




	});
	
	socket.on('publicdata',function(data){
		$('#navpage').css('display','none');
		$('#roompage').css('display','block');
		roomdata=data;
		console.log(roomdata.id);
	});

	//for chat
	


};