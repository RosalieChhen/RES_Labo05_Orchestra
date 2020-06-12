// We use a standard Node.js module to work with UDP
const dgram = require('dgram');

var protocol = {
	PROTOCOL_PORT: "4444",
	PROTOCOL_MULTICAST_ADDRESS: "239.255.22.5"
};
// Let's create a datagram socket. We will use it to listen for datagrams published in the
// multicast group by thermometers and containing measures
const s = dgram.createSocket('udp4');
s.bind(protocol.PROTOCOL_PORT, function() {
console.log("Joining multicast group");
s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

var musician_noise = new Map();
musician_noise.set("ti-ta-ti", "piano");
musician_noise.set("pouet", "trumpet");
musician_noise.set("trulu", "flute");
musician_noise.set("gzi-gzi", "violin");
musician_noise.set("boum-boum", "drum");

var listMusicians = new Map(); // va contenir tout les musiciens actif
var waitingTime = 5;

// This call back is invoked when a new datagram has arrived.
s.on('message', function(msg, source) {
	
	var keyMap = JSON.parse(msg);

	// add new musician to the list of heard musicians
	if(listMusicians.get(keyMap.uuid) == undefined){

		listMusicians.set(keyMap.uuid,{
			uuid : keyMap.uuuid,
			instrument : musician_noise.get(keyMap.noise),
			activeSince : new Date()
		});

	} else {
		// update musician last activity date
		listMusicians.get(keyMap.uuid).activeSince = new Date();
	}

});

setInterval(function(){
	listMusicians.forEach(function(value, key, map){
		var diffDate = Math.abs(new Date() - value.activeSince);
		if(diffDate / 1000 >= waitingTime){
			console.log("keyRemoved: " + key);
			console.log("valueRemoved: " + JSON.stringify(value));
			console.log("diffDate: " + diffDate);
			map.delete(key);
		}
	})
}, waitingTime);

var net = require('net');

var server = net.createServer().listen(2205);

server.on('connection', function(socket){
	socket.write(JSON.stringify(Array.from(listMusicians.values())));
	socket.destroy();
});



