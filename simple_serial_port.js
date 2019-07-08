// ----------------------------------------------------------------------------
// simple serial port communication
// created by Nicole2442

// ----------------------------------------------------------------------------
// parameter
var port1 = "COM1";
var port2 = "COM2";
var port3 = "COM3";
var port4 = "COM4";
var man = "Moxa"; // manufacturer name

// ----------------------------------------------------------------------------
var SerialPort = require("serialport");
var Readline = require('@serialport/parser-readline');
var fs = require('fs');

// ----------------------------------------------------------------------------
// list all devices
SerialPort.list(function(err, ports) {
	var allports = ports.length;
	var count = 0;
	ports.forEach(function(port) {
		count += 1;
		pm = port['manufacturer'];
		console.log(pm);
		if (typeof pm !== 'undefined' && pm.includes(man)) {
			portName = port.comName.toString();
      if(portName == port1){
        console.log("find device 1");
      }
			else if(portName == port2) {
        console.log("find device 2");
      }
			else if(portName == port3) {
				console.log("find device 3");
			}
			else if(portName == port4) {
				console.log("find device4");
			}
      else{
        console.log(portName);
      }
		}
	});
});

// initial and open deivce 1
var device1 = new SerialPort(port1, {
			baudRate: 115200,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
      flowControl: false
    });

device1.on('open', function(error) {
  if(error){
    console.log('cannot open device1');
  }
  else {
    console.log('open device1');
		device1.flush();

		// receive data from device1
		var fileName1 = "test/device_1_" + Date.now() + ".txt";
		var parserDevice1 = new Readline();
    device1.pipe(parserDevice1);
    // parserDevice1.on('data', line => console.log(`> ${line}`));
		parserDevice1.on('data', function(line){
			console.log(`> ${line}`);
			// write data in the file
			fs.appendFile(fileName1, line+"\r\n", (err) => {
				if (err) throw err;
			});
		});

		// other ways to receive data from device1
		// device1.on('data', function(data){
		// 	console.log('receive device1 data: ' + data);
		// 	// console.log(data);
		// });
  }
});

device1.on('close', function() {
  console.log('close device1');
});

device1.on('disconnect', function() {
  console.log('disconnect device1');
  device1.open();
});

device1.on('error', function(err) {
  console.log('Error device1: ', err.message);
});

// other device operation: the same as device1
