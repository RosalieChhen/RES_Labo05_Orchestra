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


// This call back is invoked when a new datagram has arrived.
s.on('message', function(msg, source) {
	console.log(msg);
	console.log("Musician is : " + musician_noise.get(msg.toString()));
	console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Sourceport: " + source.port);
});

