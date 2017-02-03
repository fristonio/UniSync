var socket = io();
console.log(socket.id);
socket.on('connect', function(){
  console.log(socket.id);
});
document.getElementsByTagName('input')[1].onclick()=function(){
document.getElementsByTagName('form')[0].submit(function(){
	socket.emit('dataemit',document.getElementsByTagName('input')[0].value);
	return false;
});
}