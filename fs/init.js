// Load Mongoose OS API
load('api_timer.js');
load('api_dht.js');
load('api_sys.js');
load('api_mqtt.js');
load('api_config.js');
load('api_arduino_ssd1306.js');
load('api_rpc.js'); //for IP reading

// Initialize Adafruit_SSD1306 library (I2C)
let d = Adafruit_SSD1306.create_i2c(2 /* RST GPIO */, Adafruit_SSD1306.RES_128_64);
// Initialize the display, try addresses 0x78, 0x3D, 0x3c
// wemos oled: OLED display are pin5 (SDA) and pin4 (SCL), SSD1306 display(0x3c, 5, 4);
d.begin(Adafruit_SSD1306.SWITCHCAPVCC, 0x3c, true /* reset */);
d.display();

let showStr = function(d, str) {
  d.clearDisplay();
  d.setTextSize(1);
  d.setTextColor(Adafruit_SSD1306.WHITE);
  d.setCursor(d.width() / 4, d.height() / 4);
  d.write(str);
  d.display();
};


// let info ={};
// RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function(resp, ud) {
//     info.mac=resp.mac;
//     info.ip=resp.wifi.sta_ip;
//     info.ssid=resp.wifi.ssid;
// });

Timer.set(5000 /* milliseconds */, Timer.REPEAT, function() {
  showStr(d, Cfg.get('device.id'));
}, null);

// GPIO pin which has a DHT sensor data wire connected
// let pin = 16;
// let ver = 1.83;
// let sensor = {working: false};

// Initialize DHT library
// let dht = DHT.create(pin, DHT.DHT22);

// let topic = 'rack/homekit/#';
// MQTT.sub(topic, function(conn, topic, msg) {
//   print('Topic:', topic, 'message:', msg);
// }, null);

// This function reads data from the DHT sensor every 2 second
// Timer.set(60000 /* milliseconds */, Timer.REPEAT, function() {
//   sensor.temperature = dht.getTemp();
//   sensor.humidity = dht.getHumidity();
//   sensor.version = ver;
//   sensor.uptime = Sys.uptime();
//   sensor.working = true;
//   if (isNaN(sensor.temperature) || isNaN(sensor.humidity)) {
//     print('Failed to read data from sensor');
//     sensor.working = false;
//     return;
//   }
//   // TODO send sensor.working message even if sensor disconected
//   print('Temperature:', sensor.temperature, '*C','  Humidity:', sensor.humidity, '%','  Version: ' sensor.version);
//   let message = JSON.stringify(sensor);
//   let topic = "mongoose/sensor";
//   let ok = MQTT.pub(topic, message, 1);
//   print('Published:', ok ? 'yes' : 'no', 'topic:', topic, 'message:', message);
// }, null);
