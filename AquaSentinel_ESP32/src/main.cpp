#include <WiFi.h>
#include <PubSubClient.h>

#define MOISTURE_SENSOR_PIN 34
#define WATER_FLOW_SENSOR_PIN 25
#define RELAY_PIN 26 // GPIO pin for the relay
volatile int pulseCount = 0;
unsigned long lastMillis = 0;

const char *ssid = "AliSabir-2G";
const char *password = "Ali@Kur_alu2022?";
const char *mqtt_server = "192.168.1.66";

WiFiClient espClient;
PubSubClient client(espClient);

// ISR for counting water flow pulses
void IRAM_ATTR pulseCounter()
{
  pulseCount++;
}

void reconnect()
{
  while (!client.connected())
  {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32Client"))
    {
      Serial.println("connected!");
      client.publish("aquasentinel/test", "🚀 ESP32 connected");
      client.subscribe("aquasentinel/valveControl");
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 2 seconds...");
      delay(2000);
    }
  }
}

void callback(char *topic, byte *message, unsigned int length)
{
  String msg;
  for (int i = 0; i < length; i++)
  {
    msg += (char)message[i];
  }

  Serial.print("MQTT [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(msg);

  if (String(topic) == "aquasentinel/valveControl")
  {
    if (msg == "ON")
    {
      digitalWrite(RELAY_PIN, HIGH);
      Serial.println("🔓 Solenoid valve OPEN");
    }
    else if (msg == "OFF")
    {
      digitalWrite(RELAY_PIN, LOW);
      Serial.println("🔒 Solenoid valve CLOSED");
    }
  }
}

void setup()
{
  Serial.begin(115200);
  pinMode(MOISTURE_SENSOR_PIN, INPUT);
  pinMode(WATER_FLOW_SENSOR_PIN, INPUT_PULLUP);
  pinMode(RELAY_PIN, OUTPUT);

  digitalWrite(RELAY_PIN, HIGH); // Start with pump OFF

  attachInterrupt(digitalPinToInterrupt(WATER_FLOW_SENSOR_PIN), pulseCounter, RISING);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi connected");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());

  // ⏱️ Configure NTP
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  while (time(nullptr) < 100000)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\n✅ Time synced");

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  int moistureValue = analogRead(MOISTURE_SENSOR_PIN);
  int moisturePercentage = map(moistureValue, 4095, 500, 0, 100);
  moisturePercentage = constrain(moisturePercentage, 0, 100);
  if (moisturePercentage < 45)
  {
    digitalWrite(RELAY_PIN, LOW); // Turn pump ON
  }
  else
  {
    digitalWrite(RELAY_PIN, HIGH); // Turn pump OFF
  }
  static int lastMoistureValue = 0;
  int change = moisturePercentage - lastMoistureValue;
  lastMoistureValue = moisturePercentage;

  float flowRate = 0.0;

  if (millis() - lastMillis >= 1000)
  {
    detachInterrupt(digitalPinToInterrupt(WATER_FLOW_SENSOR_PIN));
    flowRate = pulseCount / 7.5;

    // ✅ Clamp flowRate to 1–30 L/min inside the timing block
    if (flowRate < 1.0)
    {
      flowRate = 0.0;
    }

    else if (flowRate <= 15.0)
    {
      flowRate = flowRate; // Keep it as is
    }
    else if (flowRate <= 20.0)
    {
      flowRate = 16.0;
    }
    else if (flowRate <= 30.0)
    {
      flowRate = 17.0;
    }
    else if (flowRate <= 40.0)
    {
      flowRate = 18.0;
    }
    else if (flowRate <= 50.0)
    {
      flowRate = 19.0;
    }
    else if (flowRate <= 60.0)
    {
      flowRate = 20.0;
    }
    else if (flowRate <= 70.0)
    {
      flowRate = 20.5;
    }
    else if (flowRate <= 75.0)
    {
      flowRate = 21.0; // Adjusted to avoid exceeding 30 L/min
    }
    else if (flowRate <= 80.0)
    {
      flowRate = 22.0;
    }
    else if (flowRate <= 90.0)
    {
      flowRate = 23.0;
    }
    else if (flowRate <= 100.0)
    {
      flowRate = 24.0;
    }
    else if (flowRate <= 120.0)
    {
      flowRate = 25.0;
    }
    else if (flowRate <= 130.0)
    {
      flowRate = 26.0;
    }
    else if (flowRate <= 150.0)
    {
      flowRate = 27.0;
    }
    else if (flowRate <= 180.0)
    {
      flowRate = 28.0;
    }
    else if (flowRate <= 200.0)
    {
      flowRate = 29.0;
    }
    else if (flowRate > 200.0)
    {
      Serial.println("⚠️ WARNING: Flow exceeds sensor's safe range!");
    }

    pulseCount = 0;
    lastMillis = millis();
    attachInterrupt(digitalPinToInterrupt(WATER_FLOW_SENSOR_PIN), pulseCounter, RISING);
  }

  // ⏱️ Format timestamp
  time_t now = time(nullptr);
  char isoTime[30];
  strftime(isoTime, sizeof(isoTime), "%Y-%m-%dT%H:%M:%SZ", gmtime(&now));

  // ✅ Get pump status dynamically
  // const char *pumpStatus = digitalRead(RELAY_PIN) == LOW ? "ON" : "OFF";
  int relayState = digitalRead(RELAY_PIN);
  Serial.print("ESP32 trying to connect to broker at: ");
  Serial.println(mqtt_server);

  Serial.printf("Soil Moisture: %d%% (%+d%% change)\n", moisturePercentage, change);
  Serial.printf("Water Flow: %.2f L/min\n", flowRate);
  Serial.printf("Pump Status: %s\n", relayState == LOW ? "ON" : "OFF");
  Serial.printf("Timestamp: %s\n", isoTime);
  int userId = 2;
  char payload[180];
  snprintf(payload, sizeof(payload),
           "{ \"userId\": %d, \"moisture\": %d, \"moistureUnit\": \"%%\", \"moistureChange\": %d, \"waterFlow\": %.2f, \"flowUnit\": \"L/min\", \"pumpStatus\": \"%s\", \"timeStamp\": \"%s\"}",
           userId, moisturePercentage, change, flowRate, relayState == LOW ? "ON" : "OFF", isoTime);

  client.publish("aquasentinel/status", payload);

  delay(5000);
}
