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
	var t=(Date.now()-data.time)/1000;
	t=parseInt(t)+1;
	console.log(t);
	var link=data.link+"&start="+t;
	console.log(link);
	document.getElementById("mainvid").src=link;
});