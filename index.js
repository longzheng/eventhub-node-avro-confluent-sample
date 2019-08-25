const avro = require('avsc');
const { EventHubClient, delay } = require("@azure/event-hubs");
const schemaJson = require('./schema.json');

// Load Avro schema file
const type = avro.Type.forSchema(schemaJson);

// Connection string - primary key of the Event Hubs namespace. 
// For example: Endpoint=sb://myeventhubns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const connectionString = "<EVENT HUB CONNECTION STRING>";

// Name of the event hub. For example: myeventhub
const eventHubsName = "<EVENT HUB NAME>";

async function main() {
  const client = EventHubClient.createFromConnectionString(connectionString, eventHubsName);
  const allPartitionIds = await client.getPartitionIds();
  const firstPartitionId = allPartitionIds[0]; // Note this only gets data from the first partition

  const receiveHandler = client.receive(firstPartitionId, eventData => {
    console.log(`Received message from partition ${firstPartitionId}`);

    // Get the avro data buffer from the event body
    const avroDataBuffer = eventData.body;

    // The Confluent Platform wire format puts the Avro data from the 5th byte
    // https://docs.confluent.io/current/schema-registry/serializer-formatter.html#wire-format
    const avroDataBufferOffset = 5;

    // Decode the Avro data using the schema
    const avroData = type.decode(avroDataBuffer, avroDataBufferOffset).value;

    // Console log the output
    console.log(JSON.stringify(avroData, null, 4))
  }, error => {
    console.log('Error when receiving message: ', error)
  });;

  //Sleep for a while before stopping the receive operation.
  await delay(15000);
  await receiveHandler.stop();

  await client.close();
}

main().catch(err => {
  console.log("Error occurred: ", err);
});