# eventhub-node-avro-confluent-sample
Sample Node script to parse Avro encoded messages in Azure Event Hub using the [Confluent Serializer Wire Format](https://docs.confluent.io/current/schema-registry/serializer-formatter.html#wire-format).

Based off the sample code from https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-node-get-started-send#receive-events.

I spent hours trying to figure out why I couldn't decode Avro-formatted messages sent (mirrored using the Kafka MirrorMaker) to the Event Hub. Then I came across the Confluent Platform documentation about the [Wire Format](https://docs.confluent.io/current/schema-registry/serializer-formatter.html#wire-format) which pointed out the Avro data was wrapped in a lightweight Confluent container with extra metadata at 0-4 bytes for the Schema Registry.

### How to use
1. Run `npm install`
2. Update `schema.json` with your own Avro schema file
3. Update `index.js` with your Event Hub connection string and hub name
4. Run `node index.js`