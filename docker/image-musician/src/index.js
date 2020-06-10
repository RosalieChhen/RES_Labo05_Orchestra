// Sending a message to all nodes on the local network
var dgram = require('dgram');
var s = dgram.createSocket('udp4');


var protocol = {
	PROTOCOL_PORT: "4444",
	PROTOCOL_MULTICAST_ADDRESS: "239.255.22.5"
};

var noise;

switch(process.argv[2]){
	case "piano":
		noise = "ti-ta-ti";
		break;
	case "trumpet":
		noise = "pouet";
		break;
	case "flute":
		noise = "trulu";
		break;
	case "violin":
		noise = "gzi-gzi";
		break;
	case "drum":
		noise = "boum-boum";
		break;
	default:
		throw "Instrument is not valid";
}

var payload = noise;

message = Buffer.from(payload);	

setInterval(function(){
	// Send the payload via UDP (multicast)
	s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
	function(err, bytes) {
		console.log("Sending payload: " + payload + " via port " + s.address().port);
	});
}, 1000);



