window.onload=function(){
	var socket = io();
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
		console.log(this.id);
		socket.emit('room-select',this.id);
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
		socket.emit('joinpublic');
	});
	socket.on('publicdata',function(data){
		$('#navpage').css('display','none');
		$('#roompage').css('display','block');
		roomdata=data;
		console.log(roomdata.id);
	});
};

$(document).ready(function(){

	$('#btn-pri-c,#btn-pri-j').click(function(){
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},500);
		$('.form-pri').css('display','flex').animate({'left':'20vw'},500);
	});	


	$('#btn-pub-j').click(function(){
		$('.black').css('background-color','#fff');
		$('.white').css('background-color','#000');
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},500);
		$('#roompage').fadeIn(200);
	});

	$('#close-pub').click(function(){
		$('.black').css('background-color','#000');
		$('.white').css('background-color','#fff');
		$('.black>button,.black>h4,.white>button,main h1').fadeIn();
		$('.black').animate({'width':'50vw'},500);
		$('#roompage').hide(0);
	})






});