// Load Mongoose OS API
load('api_timer.js');
load('api_dht.js');
load('api_sys.js');
load('api_mqtt.js');

// GPIO pin which has a DHT sensor data wire connected
let pin = 16;
let ver = 1.1;
let state = {on: false};
// Initialize DHT library
let dht = DHT.create(pin, DHT.DHT22);

// This function reads data from the DHT sensor every 2 second
Timer.set(2000 /* milliseconds */, Timer.REPEAT, function() {
  let t = dht.getTemp();
  let h = dht.getHumidity();
  if (isNaN(h) || isNaN(t)) {
    print('Failed to read data from sensor');
    return;
  }
  print('Temperature:', t, '*C','  Humidity:', h, '%','  Version: ' ver);
}, null);


Timer.set(5000, Timer.REPEAT, function() {
  state.uptime = Sys.uptime();
  state.ram_free = Sys.free_ram();
  print("syestem: ", JSON.stringify(state));
}, null);
