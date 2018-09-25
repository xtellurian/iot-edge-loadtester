# edge-loadtest

### This repo contains code and configurations that reproduce an error in the IoT Edge runtime.

## What's here

* Two simple modules written in NodeJS. One produces events, to which the other appends a message number.
* Two important deployment files
  * `/StabilityTester/config/concurrent.equalAverage.franky.deployment.json`
  * `/StabilityTester/config/nonConcurrent.equalaverage.dolly.deployment.json`

## Steps to repo

* Install the [IoT Edge toolkit](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit) for VS Code
* Create an IoT Hub and authenticate through VS Code
* Provision two Raspberry Pi 3's as IoT Edge Devices (as code, one called Franky and one called Dolly)
* In VS Code, right click each of those devices and deploy the corresponding deployment.json

### Expected Result

Both devices continue to send messages to IoT Hub

### Actual Result

The device sending messages concurrently will (at some point, approx <24hrs later) cease sending messages to IoT Hub

## Interpretation

The only difference between the two deployments are the environment variables CONCURRENCY and INTERVAL, which determine the frequency and concurrency of events from EventGenerator. The two deployment have the same average value of events/sec, but franky sends all his at once. You should find that in less than 24hrs, franky has ceased to function, in that he is no longer sending messages to IoT Hub. However, all his modules are reported as 'running'. Dolly acts as a control case.
