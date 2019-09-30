// Load Mongoose OS API
load('api_timer.js');
load('api_dht.js');

// GPIO pin which has a DHT sensor data wire connected
let pin = 16;
let ver = 1.0;

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

  print('Temperature:', t, '*C');
  print('Humidity:', h, '%');
  print('Version: ' ver);
}, null);
