// --------------------------------------------------------------------------------
var portLidco = "COM1";
var portCasmedCH1 = "COM2";
var portCasmedCH2 = "COM5";
var portDevice = "COM6";
var portArduino = "COM7"; // hardware simulator device

var nameLidco = "LIDCO";
var nameCasmed = "CASMED";
var nameArduino = "ARDUINO";

var httpServer = "localhost";
var port = 8889;

// --------------------------------------------------------------------------------
const fs = require('fs');

const http_client = require('./js/client');
const serial_port = require('./js/serial_port');

// --------------------------------------------------------------------------------
// init data client for transmittion: check http server
var data_client = new http_client(httpServer, port);
data_client.checkSite((res) => {
    if (res.statusCode == '200') {
        console.log("http server connect SUCCESS");
    }
});

// init serial port: check the serial port
// listDevice(portArduino);
listDevice(portLidco);
listDevice(portCasmedCH1);
listDevice(portCasmedCH2);

// open serial device, get data and transmit
// var portCasmedCH1 = new serial_port(portArduino);
var portCasmedCH1 = new serial_port(portCasmedCH1);
portCasmedCH1.portOpen(57600, 8, 'none', 1, false, (res) => {
    if (res.path == portCasmedCH1) {
        console.log(res.path);
    }
});
// serial error report
portCasmedCH1.portError();

// --------------------------------------------------------------------------------
// register device and get udp port
var data_udp_port = -1;
const device_data = {
    "type": nameCasmed,
    "dev_no": "00001",
};
data_client.sendDeviceInfo(device_data, (res, body) => {
    if (res.statusCode == '200') {
        let udp_info = JSON.parse(body);
        console.log(udp_info.port);
        if (udp_info.port != -1) {
            data_udp_port = udp_info.port;
        }
    }
});

// serial port receive data and transmit the data out through udp port
// var fileName = "test/" + nameCasmed + "_" + Date.now() + ".txt";
portCasmedCH1.portReceive((res) => {
    console.log(res);

    // write data in the file
    // fs.appendFile(fileName, res + "\r\n", (err) => {
    //     if (err) throw err;
    // });

    // send the data through udp
    if (data_udp_port != -1) {
        data_client.udpSend(data_udp_port, res);
    }
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