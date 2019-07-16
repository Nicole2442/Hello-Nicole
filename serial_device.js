// --------------------------------------------------------------------------------
var portDevice = "COM1";
var nameDevice = "SERIAL";

// --------------------------------------------------------------------------------
const fs = require('fs');
const serial_port = require('./js/serial_port');

// --------------------------------------------------------------------------------
// init serial port: check the serial port
listDevice(portDevice);

// open serial device, get data and transmit
var device = new serial_port(portDevice);
device.portOpen(57600, 8, 'none', 1, false, (res) => {
    if (res.path == device) {
        console.log(res.path);
    }
});
// serial error report
device.portError();

// --------------------------------------------------------------------------------
// serial port receive data and transmit the data out through udp port
var fileName = "test/" + nameDevice + "_" + Date.now() + ".txt";
device.portReceive((res) => {
    console.log(res);

    // write data in the file
    fs.appendFile(fileName, res + "\r\n", (err) => {
        if (err) throw err;
    });
});

// --------------------------------------------------------------------------------
// list serial ports
function listDevice(portNum) {
    var port = new serial_port(portNum);
    port.portFind((res) => {
        if (res == true) {
            console.log("find device: " + portNum);
        }
    });
}