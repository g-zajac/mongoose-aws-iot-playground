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
d.clearDisplay();
d.setTextSize(1);
// d.setTextColor(Adafruit_SSD1306.WHITE);
d.setTextColor(Adafruit_SSD1306.WHITE, Adafruit_SSD1306.BLACK);

let showStr = function(d, line, str) {
  let textHeight = 8;
  //clear line
  // d.setTextColor(BLACK);
  d.setCursor(0,(line-1)*textHeight);
  d.write("                   -"); //line 21 characters?
  d.display();
  // d.setTextColor(Adafruit_SSD1306.WHITE);
  // d.setTextColor(WHITE);
  d.setCursor(0,(line-1)*textHeight);
  d.write(str);
  d.display();
};

Timer.set(1000 /* milliseconds */, Timer.REPEAT, function() {
  RPC.call(RPC.LOCAL, 'Sys.GetInfo', null, function(resp, ud) {
    // print('Response:', JSON.stringify(resp));
    let deviceIP = "IP: " + resp.wifi.sta_ip;
    showStr(d,2,deviceIP);
    let time = "uptime: " + JSON.stringify(resp.uptime);
    print("uptime ->", time);
    showStr(d,3,time);
  }, null);
  let deviceID = "ID: " + Cfg.get('device.id');
  showStr(d,1,deviceID);
}, null);

let topic = 'nodered/temperature';
MQTT.sub(topic, function(conn, topic, msg) {
  // print('Topic:', topic, 'message:', msg);
  let rackTemp = JSON.parse(msg);
  rackTemp = rackTemp.temperature;
  print('rack temperature:', rackTemp);
  let string2display = "temp: " + JSON.stringify(rackTemp);
  showStr(d,8,string2display);
}, null);

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
