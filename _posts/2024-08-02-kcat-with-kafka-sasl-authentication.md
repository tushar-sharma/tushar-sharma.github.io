---
layout: post
title: Using kcat with Kafka and SASL Authentication
image: 'https://images.pexels.com/photos/933843/pexels-photo-933843.jpeg?w=800'
thumb: 'https://images.pexels.com/photos/933843/pexels-photo-933843.jpeg?w=800'
author: tushar sharma
category: blog
tags:
 - kafka
---

kcat (formerly known as kafkacat) is a versatile command-line tool for Apache Kafka. It allows you to consume and produce Kafka messages and interact with Kafka clusters efficiently. This guide will help you set up and use kcat with SASL authentication to consume and produce messages.<!-- truncate_here -->

kcat (formerly known as kafkacat) is a versatile command-line tool for Apache Kafka. It allows you to consume and produce Kafka messages and interact with Kafka clusters efficiently. This guide will help you set up and use kcat with SASL authentication to consume and produce messages.

### Prerequisites

Ensure that kcat is installed on your system. If not, you can find installation instructions in the [kcat GitHub repository](https://github.com/edenhill/kcat).

### Prepare Your SASL Authentication Details

You'll need the following SASL authentication details:
- SASL username
- SASL password
- SASL mechanism (typically PLAIN or SCRAM-SHA-256/SHA-512)

### Consuming Messages

#### Basic Consumption Command

To consume messages from a Kafka topic using kcat with SASL authentication, use the following command:

```bash
$ kcat -C -b broker1:9092,broker2:9092 -t <topic> \
       -X security.protocol=sasl_ssl \
       -X sasl.mechanisms=SCRAM-SHA-512 \
       -X sasl.username=<username> \
       -X sasl.password=<password> \
       -X ssl.ca.location=<path_to_ca_cert> \
       -o -1 -e -J
```

**Options Explained:**
- \`-C\`: Consume mode.
- \`-b\`: List of brokers.
- \`-t\`: Topic name.
- \`-X security.protocol=sasl_ssl\`: Use SASL_SSL for communication.
- \`-X sasl.mechanisms=SCRAM-SHA-512\`: Specify the SASL mechanism.
- \`-X sasl.username=<username>\`: SASL username.
- \`-X sasl.password=<password>\`: SASL password.
- \`-X ssl.ca.location=<path_to_ca_cert>\`: Path to the CA certificate.
- \`-o -1\`: Start consuming from the latest message.
- \`-e\`: Exit after the last message is received.
- \`-J\`: Output messages in JSON format.

#### Example JSON Output

When consuming messages with the above command, the output will be in JSON format, including metadata such as offset, partition, and timestamp.

```json
{
  "topic": "sample-topic",
  "partition": 0,
  "offset": 12345,
  "tstype": "create",
  "ts": 1626894728000,
  "key": null,
  "payload": "{"eventType":"EVENT_TYPE","source":"SOURCE_SYSTEM"}"
}
```

#### Additional Consumption Scenarios

1. **Consume from the Earliest Offset**

```bash
$ kcat -C -b broker1:9092,broker2:9092 -t your-topic \
        -X security.protocol=sasl_ssl \
        -X sasl.mechanisms=SCRAM-SHA-512 \
        -X sasl.username=your-username \
        -X sasl.password=your-password \
        -X ssl.ca.location=/path/to/ca.pem \
        -o beginning -e -J
```

2. **Consume from the Latest Offset**

```bash
$ kcat -C -b broker1:9092,broker2:9092 -t your-topic \
        -X security.protocol=sasl_ssl \
        -X sasl.mechanisms=SCRAM-SHA-512 \
        -X sasl.username=your-username \
        -X sasl.password=your-password \
        -X ssl.ca.location=/path/to/ca.pem \
        -o end -e -J
```

### Producing Messages

To publish messages to a Kafka topic, use the following command:

```bash
echo '{"key":"value", "anotherKey":123}' | kcat -P -b broker1:9092,broker2:9092 -t <topic> \
    -X security.protocol=sasl_ssl \
    -X sasl.mechanisms=SCRAM-SHA-512 \
    -X sasl.username=your-username \
    -X sasl.password=your-password \
    -X ssl.ca.location=/path/to/ca.pem
```

For larger or more complex JSON payloads, consider using a file or another program to generate the JSON and pipe it into kcat.

#### Using a JSON File

1. Create a file, \`message.json\`:

```json
{
    "key": "value",
    "anotherKey": 123
}
```

2. Produce the message from the file:

```bash
$ kcat -P -b broker1:9092,broker2:9092 -t your-topic \
           -X security.protocol=sasl_ssl \
           -X sasl.mechanisms=SCRAM-SHA-512 \
           -X sasl.username=your-username \
           -X sasl.password=your-password \
           -X ssl.ca.location=/path/to/ca.pem \
           -l message.json
```

### Understanding SASL Authentication in Kafka

**SASL (Simple Authentication and Security Layer)** is a framework for authentication and data security in internet protocols. In the context of Kafka, SASL provides a way to authenticate clients to Kafka brokers.

Kafka supports multiple SASL mechanisms, including:

- **PLAIN**: Uses plain text username and password for authentication. It’s simple but not secure without SSL.
- **SCRAM-SHA-256**: Uses the SCRAM (Salted Challenge Response Authentication Mechanism) with SHA-256 hashing. It is more secure than PLAIN.
- **SCRAM-SHA-512**: Uses SCRAM with SHA-512 hashing, providing even stronger security than SHA-256.

**How Kafka Uses SASL Internally:**

1. **Authentication**: When a client connects to a Kafka broker, it uses the specified SASL mechanism to authenticate. The broker validates the credentials against its configuration or a user management system.
2. **Encryption**: When combined with SSL (SASL_SSL), the data transmitted between the client and the broker is encrypted, providing both authentication and confidentiality.

### Conclusion

Using \`kcat\` with SASL authentication enables secure communication with Kafka clusters. By understanding and utilizing the different options and scenarios, you can efficiently consume and produce messages while ensuring the security of your Kafka interactions. Whether you're dealing with simple messages or complex JSON payloads, \`kcat\` provides a robust toolset for working with Kafka.
