'use strict';

var Transport = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').ModuleClient;
var Message = require('azure-iot-device').Message;

const concurrency = parseInt(process.env.CONCURRENCY) || 1;

console.log(`Concurrency is ${concurrency}`);

Client.fromEnvironment(Transport, function (err, client) {
  if (err) {
    throw err;
  } else {
    client.on('error', function (err) {
      throw err;
    });

    // connect to the Edge instance
    client.open(function (err) {
      if (err) {
        throw err;
      } else {
        console.log('IoT Hub module client initialized');

        // Act on input messages to the module.
        client.on('inputMessage', function (inputName, msg) {
          pipeMessage(client, inputName, msg);
        });

        var interval = parseInt(process.env.INTERVAL || 1); // every second is default
        // set an interval once for each number of concurrent messages we're going to send
        for (var i = 1; i <= concurrency; i++) setInterval( () => sendEvent(client), 1000 * interval); 
      }
    });
  }
});

function sendEvent(client) {
  console.log("Generating Event...");
  var message = JSON.stringify({timestamp: new Date()});
    if (message) {
      var outputMsg = new Message(message);
      client.sendOutputEvent('event', outputMsg, printResultFor('Sending received message'));
    }
}

// This function just pipes the messages without any change.
function pipeMessage(client, inputName, msg) {
  client.complete(msg, printResultFor('Receiving message'));

  if (inputName === 'input1') {
    var message = msg.getBytes().toString('utf8');
    if (message) {
      var outputMsg = new Message(message);
      client.sendOutputEvent('output1', outputMsg, printResultFor('Sending received message'));
    }
  }
}

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) {
      console.log(op + ' error: ' + err.toString());
    }
    if (res) {
      console.log(op + ' status: ' + res.constructor.name);
    }
  };
}
