var socket = io();
console.log(socket.id);
socket.on('connect', function(){
  console.log(socket.id);
});
document.getElementsByTagName('form')[0].onsubmit=function(){
	socket.emit('dataemit',{'link': document.getElementsByTagName('input')[0].value , 'time':Date.now()});
	return false;
};