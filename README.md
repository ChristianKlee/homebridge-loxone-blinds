# homebridge-loxone-blinds
Websocket based Loxone blinds plugin for homebridge

This is a Loxone plugin for [Homebridge](https://github.com/nfarina/homebridge)
The plugin will automatically retrieve and communicate with all blinds from your Loxone setup:

The only configuration needed is the credentials to your Loxone miniserver.

### Benefits

* Realtime and very fast 2-way updates by using the websocket connection
* One-touch deployment through automatic import of Loxone controls

### Prerequisites
[Homebridge](https://github.com/nfarina/homebridge)
Follow all the installation steps there.

### Installation

Install the plugin through npm or download the files from here.

```sh
$ sudo npm install -g homebridge-loxone-blinds
```
Or update to latest version when already installed:
```sh
$ sudo npm update -g homebridge-loxone-blinds
```

Note: the plugin requires extra node modules, but these should be automatically installed:
- node-lox-ws-api
- request

##### Homebridge config.json

Add the platform section to your Homebridge config.json (usually in ~/.homebridge):
```
{
    "bridge": {
        "name": "Homebridge",
        "username": "CA:AA:12:34:56:78",
        "port": 51826,
        "pin": "012-34-567"
    },

    "description": "Your config file.",

    "platforms": [
        {
            "platform": "LoxoneBlinds",
            "name": "Loxone",
            "host": "192.168.1.2",
            "port": "12345",
            "username": "homebridge",
            "password": "somepassword"
        }
    ]
}

Credits
----
This plugin is a simplified and modified version of [Sam Roose - homebridge-loxone-ws](https://github.com/Sroose/homebridge-loxone-ws).
