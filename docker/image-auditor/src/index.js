// We use a standard Node.js module to work with UDP
const dgram = require('dgram');
const { v4: uuidv4 } = require('uuid');

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

// This call back is invoked when a new datagram has arrived.
s.on('message', function(msg, source) {
	console.log(msg);
	console.log("Musician is : " + musician_noise.get(msg.toString()));
	console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Sourceport: " + source.port);
	
	var keyMap = source.address + "-" + source.port;
	// add new musician to the list of heard musicians
	if(listMusicians.get(keyMap) == undefined){

		listMusicians.set(keyMap,{
			uuid : uuidv4(),
			instrument : musician_noise.get(msg.toString()),
			activeSince : new Date()
		});

	} else {
		// update musician last activity date
		listMusicians.get(keyMap).activeSince = new Date();
	}

});

setInterval(function(){
	listMusicians.forEach(function(value, key, map){
		if(Math.abs(new Date - value.activeSince) > 10000){
			map.delete(key);
		}
	})
}, 10000);

var net = require('net');

var server = net.createServer().listen(2205);

server.on('connection', function(socket){
	socket.write(JSON.stringify(Array.from(listMusicians.values())));
});



