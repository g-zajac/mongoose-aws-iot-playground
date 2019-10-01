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
let ver = 1.79;
let state = {on: false};
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
  let t = dht.getTemp();
  let h = dht.getHumidity();
  if (isNaN(h) || isNaN(t)) {
    print('Failed to read data from sensor');
    return;
  }
  print('Temperature:', t, '*C','  Humidity:', h, '%','  Version: ' ver);
  strip.setPixel(1, 0, 10, 0);
  strip.show();
}, null);


Timer.set(5000, Timer.REPEAT, function() {
  strip.setPixel(2, 0, 50, 50);
  strip.show();
  state.uptime = Sys.uptime();
  state.ram_free = Sys.free_ram();
  let message = JSON.stringify(state);
  let topic = "mongoose/sys";
  let ok = MQTT.pub(topic, message, 1);
  print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
  strip.setPixel(2, 0, 10, 10);
  strip.show();
}, null);
