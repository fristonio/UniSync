window.onload=function(){

	
	var socket = io();
	socket.on('enterUser',function(){
		
	});
	

	console.log(socket.id);
	socket.on('connect', function(){
	  console.log(socket.id);
	});

	var roomdata;

	/*document.getElementsByClassName('join')[0].onclick=function(){
		var jr=document.getElementsByClassName('join-room')[0];
		jr.style.zIndex="5";
		jr.style.display="flex";
	};

	document.getElementsByClassName("close")[0].onclick=function(){
		this.parentNode.style.display="none";
	};*/

	$('#btn-pri-j').click(function(){
		socket.emit('room-search');
	});
	/*document.getElementsByClassName('privateroom')[0].onclick=function(){
		socket.emit('room-search');
	}*/
	socket.on('roomdata',function(data){
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('#joinPri').fadeIn();
		console.log(data);
		for(var i=0;i<data.length;i++){
			$('#joinPri').append("<h3 id='"+data[i].rid+"'>"+data[i].rname+"</h3>");
		}
	});


//private room selection 
	var privaterid;
	$('#joinPri').on('click','h3',function(){
		privaterid=this.id;
		console.log(privaterid);
		var password=prompt("Enter the password for the room : ");
		console.log(password);
		socket.emit('pass_check',{'pass':password,'id':this.id});
		$('#joinPri').hide(0);
		//$('.roompage,.chat_wrapper').fadeIn(200);
	});

	socket.on('pass_verified',function(){
			var name=prompt('Enter a Username to chat');
			console.log(name);
			socket.emit('setUsername',{'prid':privaterid,'name':name});
			socket.on('setUsernameSuc',function(){
			//alert('username successfully created');
				});
			socket.on('userExists',function(){
			var name=prompt('Username already Exits. Enter A new one');
			socket.emit('setUsername',{'prid':privaterid,'name':name});
			});
			console.log(privaterid);
			$('#msgsubmitpublic').css({'display':'none'}); //chat button to be added in index.html
			socket.emit('room-select',privaterid);
		});

	socket.on('wrong-pass',function(){
		alert('Sorry the password entered did not match with the actual password..... TRY AGAIN ');
		var password=prompt("Enter the password for the room again : ");
		console.log(password+"renter");
		console.log(privaterid);
		socket.emit('pass_check',{'pass':password,'id':privaterid});
	});

	socket.on('displayCurrUser',function(data){

		console.log('going to display user');
		$('.curruser').append('<h3>'+data.name+'</h3>'); //chat current user
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
		//alert();
		console.log(data);
		added='<span style="font-weight:800">'+data.curruser+' : </span>'+'<span class="message">'+data.msg+'</span><br>';
		document.getElementById("premsg").innerHTML+=added;
	});





	socket.on('roompagenav',function(data){
		$('.black').css('background-color','#fff');
		$('.white').css('background-color','#000');
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('.roompage,.chat_wrapper').fadeIn(200);
		/*$('#navpage').css('display','none');
		$('.roompage').css('display','block');*/
		roomdata=data;
		$('.roompage').attr('id',roomdata.id); // possible problem
		console.log(roomdata);
	});
/*
	document.getElementById('linkform').onsubmit=function(){
		var link=document.getElementById('linkfield').value;
		console.log(link);
		link=link.replace('/watch?v=','/embed/');
		link=link+"?autoplay=1";
		socket.emit('dataemit',{'link': link , 'time':Date.now(),'roomid':roomdata.id});
		document.getElementById("mainvid").src=link;
		return false;
	};
*/
		$('#yout-search').submit(function(){
		var link = $('.formdiv input').eq(0).val();
		link=link.replace('/watch?v=','/embed/');
		link=link+"?autoplay=1";
		socket.emit('dataemit',{'link': link , 'time':Date.now(),'roomid':roomdata.id});
		$('#mainvid').attr('src',link);
		return false;
	});


	socket.on('playnow',function(data){
		t=data.curtime;
		console.log(t);
		var link=data.link+"&start="+t;
		console.log(link);
		$('#mainvid').attr('src',link); //document.getElementById("mainvid").src=link;
	});

	$('.sync-btn').click(function(){
		socket.emit('sync',roomdata.id);
	});
	/*
	document.getElementsByClassName('sync-btn')[0].onclick=function(){
		socket.emit('sync',roomdata.id);
	}*/
	/*document.getElementsByTagName('form')[0].onsubmit=function(){
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
	}*/

//create private room on the server
	/*$('.create').click(function(){
		$('#createroom').css('display','flex');
		var roomname=prompt("Enter your room name  :  ");
		if(roomname!=null){
			socket.emit('create-room',roomname);
		}
	});*/

	$('#pri-sub').on('click',function(){
		var createroomdata={'rname':'','pass':''};
		createroomdata.rname=$('#pri-name').val();
		createroomdata.pass=$('#pri-pass').val();
		console.log("the room data for creation is "+createroomdata);
		socket.emit('create-room',createroomdata);
		return false;
	});

	socket.on('room-created',function(data){
		alert('Congo your room has been created _/\\ _ with name  : '+data);
		close_pri(); // go back to home
	});

//public room joining
	$('#btn-pub-j').click(function(){
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
		$('#msgsubmitprivate').css({'display':'none'}); //chat private button display none
		socket.emit('joinpublic',name);

	});

	socket.on('publicdata',function(data){
		/*$('#navpage').css('display','none');
		$('.roompage').css('display','block');*/ //possible error
		$('.black').css('background-color','#fff');
		$('.white').css('background-color','#000');
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('.roompage,.chat_wrapper').fadeIn(200);
		roomdata=data;
		console.log(roomdata.id);
	});

	//for chat
	


/*jquery animations*/

	$('#btn-pri-c').click(function(){
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('.createPri').css('display','flex').animate({'left':'0'},400);
	});	

	/*$('#btn-pri-j').click(function(){
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('#joinPri').fadeIn();		
	});*/

	/*$('#btn-pub-j').click(function(){
		$('.black').css('background-color','#fff');
		$('.white').css('background-color','#000');
		$('.black>button,.black>h4,.white>button,main h1').hide(0);
		$('.black').animate({'width':'75vw'},400);
		$('.roompage,.chat_wrapper').fadeIn(200);
	});*/

	$('.close-pub').click(function(){
		$('.black').css('background-color','#000');
		$('.white').css('background-color','#fff');
		$('.black>button,.black>h4,.white>button,main h1').fadeIn();
		$('.black').animate({'width':'50vw'},400);
		$('.roompage,.chat_wrapper').hide(0);
	});

	function close_pri(){
		$('.black>button,.black>h4,.white>button,main h1').fadeIn();
		$('.black').animate({'width':'50vw'},400);
		$('.createPri').animate({'left':'-75vw'},1).hide(0);
		$('#joinPri').hide(0);
	};

	$('.close-pri').click(close_pri);
};