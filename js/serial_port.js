// ----------------------------------------------------------------------------
// Created by Nicole Liao 20190710
class serial_port {
    constructor(portNum) {
        this.portNum = portNum;
        this.port = null;
        this.serial = require("serialport");
        this.readline = require('@serialport/parser-readline');
    }

    // check if the serial port exist
    portFind(callback = null) {
        var portNum = this.portNum;
        var manufacturerName = 'Moxa'; // manufacture name
        this.serial.list(function(err, ports) {
            var allports = ports.length;
            var count = 0;
            ports.forEach(function(port) {
                count += 1;
                var pm = port['manufacturer'];
                // console.log(pm)
                if (typeof pm !== 'undefined' && pm.includes(manufacturerName)) {
                    var moxaport = port.comName.toString();
                    var res = false;
                    if (portNum == moxaport) {
                        res = true;
                    } else {
                        res = false;
                    }
                    if (callback != null) {
                        callback(res);
                    }
                }
            });
        });
    }

    // open the serial port with specific configuration
    portOpen(baudRate, dataBits, parity, stopBits, flowControl, callback = null) {
        const device = new this.serial(this.portNum, {
            baudRate: baudRate,
            dataBits: dataBits,
            parity: parity,
            stopBits: stopBits,
            flowControl: flowControl
        });
        this.port = device;
        var self = this;

        self.port.on('open', function(error) {
            // var res = false;
            if (error) {
                console.log(">serial_port: open error");
            } else {
                if (callback != null) {
                    // console.log(device.path);
                    callback(self.port);
                }
            }
        });
    }

    // receive data
    portReceive(callback = null) {
        var parser = new this.readline();
        this.port.pipe(parser);

        parser.on('data', function(line) {
            // console.log(`>serial_port_receive:  ${line}`);
            if (callback != null) {
                callback(line);
            }
        });
    }

    // error report
    portError(callback = null) {
        this.port.on('error', function(err) {
            console.log('>serial_port_ERROR: ', err.message);
        });
    }

    // send data
    // portSend(data, callback = null) {}

    // disconnect port
    // portDisconnect(callback = null) {}

    // close the serial port
    // portClose(callback = null) {
    //     this.port.on('close', function(error) {
    //         var res = false;
    //         if(error){
    //             res = false;
    //             console.log(">serial_port: close error");
    //         }
    //         else {
    //             res = true;
    //         }
    //         if (callback != null) {
    //             callback(res);
    //         }
    //     });
    // }

}

module.exports = serial_port;