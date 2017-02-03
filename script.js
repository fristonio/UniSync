var socket = io();
console.log(socket.id);
socket.on('connect', function(){
  console.log(socket.id);
});
document.getElementsByTagName('form')[0].onsubmit=function(){
	link=document.getElementsByTagName('input')[0].value ;
	link=link.replace('/watch?v=','/embed/');
	socket.emit('dataemit',{'link': link , 'time':Date.now()});
	document.getElementById("mainvid").src=link;
	return false;
};

socket.on('playnow',function(data){
	link=data.link;
	document.getElementById("mainvid").src=link;
});