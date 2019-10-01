// Load Mongoose OS API
load('api_timer.js');
load('api_dht.js');
load('api_sys.js');
load('api_mqtt.js');
load('api_config.js');
load('api_neopixel.js');

let pin = 17, numPixels = 8, colorOrder = NeoPixel.GRB;
let strip = NeoPixel.create(pin, numPixels, colorOrder);

strip.clear();
strip.setPixel(0, 10, 0, 0);
strip.show();

// GPIO pin which has a DHT sensor data wire connected
let pin = 16;
let ver = 1.83;
let sensor = {working: false};
// Initialize DHT library
let dht = DHT.create(pin, DHT.DHT22);
let topic = 'rack/homekit/#';
MQTT.sub(topic, function(conn, topic, msg) {
  print('Topic:', topic, 'message:', msg);
}, null);

// This function reads data from the DHT sensor every 2 second
Timer.set(2000 /* milliseconds */, Timer.REPEAT, function() {
  strip.setPixel(1, 0, 50, 0);
  strip.show();
  sensor.temperature = dht.getTemp();
  sensor.humidity = dht.getHumidity();
  sensor.version = ver;
  sensor.uptime = Sys.uptime();
  sensor.working = true;
  if (isNaN(sensor.temperature) || isNaN(sensor.humidity)) {
    print('Failed to read data from sensor');
    sensor.working = false;
    return;
  }
  // TODO send sensor.working message even if sensor disconected
  print('Temperature:', sensor.temperature, '*C','  Humidity:', sensor.humidity, '%','  Version: ' sensor.version);
  let message = JSON.stringify(sensor);
  let topic = "mongoose/sensor";
  let ok = MQTT.pub(topic, message, 1);
  print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
  strip.setPixel(1, 0, 10, 0);
  strip.show();
}, null);
