window.onload=function(){
	var socket = io();
	console.log(socket.id);
	socket.on('connect', function(){
	  console.log(socket.id);
	});


	document.getElementsByTagName('form')[0].onsubmit=function(){
		var link=document.getElementsByTagName('input')[0].value ;
		link=link.replace('/watch?v=','/embed/');
		link=link+"?autoplay=1";
		socket.emit('dataemit',{'link': link , 'time':Date.now()});
		document.getElementById("mainvid").src=link;
		return false;
	};

	socket.on('playnow',function(data){
		//var t=(Date.now()-data.time)/1000;
		//t=parseInt(t)+1;
		t=data.curtime;
		console.log(t);
		var link=data.link+"&start="+t;
		console.log(link);
		document.getElementById("mainvid").src=link;
	});
	document.getElementsByClassName('sync-btn')[0].onclick=function(){
		socket.emit('sync');
	}

	document.getElementsByClassName('join')[0].onclick=function(){
		var jr=document.getElementsByClassName('join-room')[0];
		jr.style.zIndex="5";
		jr.style.display="flex";
	};

	document.getElementsByClassName("close")[0].onclick=function(){
		this.parentNode.style.display="none";
	};


};