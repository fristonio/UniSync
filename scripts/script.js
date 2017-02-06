window.onload=function(){
	var socket = io();
	console.log(socket.id);
	socket.on('connect', function(){
	  console.log(socket.id);
	});

	var roomdata;

	$('.joinPri').click(function(){
		socket.emit('room-search');
	});
	socket.on('roomdata',function(data){
		$('#joinPri').show(0);
		console.log(data);
		for(var i=0;i<data.length;i++){
			$("#joinPri").append("<h3 id='"+data[i].rid+"'>"+data[i].rname+"</h3>");
		}
	});


//private room selection 
	$('#joinPri').on('click','h3',function(){
		console.log(this.id);
		socket.emit('room-select',this.id);
	});

	socket.on('roompagenav',function(data){
		$('#roompage').css('display','block');
		roomdata=data;
		$('#roompage').attr('id',roomdata.id);
		console.log(roomdata);
	});

	$('#yout-search').submit(function(){
		var link = $('.formdiv input').eq(0).val();
		link=link.replace('/watch?v=','/embed/');
		link=link+"?autoplay=1";
		socket.emit('dataemit',{'link': link , 'time':Date.now(),'roomid':roomdata.id});
		$('#mainvid').attr('src',link);
		return false;
	})

	socket.on('playnow',function(data){
		t=data.curtime;
		console.log(t);
		var link=data.link+"&start="+t;
		console.log(link);
		$('#mainvid').attr('src','link');
	});

	$('.sync-btn').click(function(){
		socket.emit('sync',roomdata.id);
	});

//create private room on the server
	$('#pri-sub').click(function(){
		var roomname = $('#pri-name').val();
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


/*jquery animations*/
$(document).ready(function(){

	$('#btn-pri-c').click(function(){
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('.createPri').css('display','flex').animate({'left':'0'},400);
	});	

	$('#btn-pri-j').click(function(){
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('#joinPri').fadeIn();		
	});

	$('#btn-pub-j').click(function(){
		$('.black').css('background-color','#fff');
		$('.white').css('background-color','#000');
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('#roompage').fadeIn(200);
	});

	$('.close-pub').click(function(){
		$('.black').css('background-color','#000');
		$('.white').css('background-color','#fff');
		$('.black>button,.black>h4,.white>button,main h1').fadeIn();
		$('.black').animate({'width':'50vw'},400);
		$('#roompage').hide(0);
	});

	$('.close-pri').click(function(){
		$('.black>button,.black>h4,.white>button,main h1').fadeIn();
		$('.black').animate({'width':'50vw'},400);
		$('.createPri').animate({'left':'-75vw'},1).hide(0);
		$('#joinPri').hide(0);
	});

});