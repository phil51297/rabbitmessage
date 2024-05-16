# Overview

This project demonstrates a Node.js application that integrates with RabbitMQ, to send and receive messages through a queue. The application uses Express for handling HTTP requests and the amqplib library for RabbitMQ integration.

## Installation
Clone the repository: 
``` https://github.com/phil51297/rabbitmessage.git ```

Navigate to the project directory:
```
cd rabbitmq-nodejs
```
Install dependencies:
```
npm install
```
## Using Docker
Build the Docker image:
```
docker compose up
```
## API
POST
```
http://localhost:8080/api/send
```
This endpoint allows you to send a message using RabbitMQ. It expects a JSON payload with a `message` request body.

### Request or payload
```
{
  "message": "Your message here"
}
```
### Responses Success (200 OK)
```
{
  "status": "Ok",
  "message": "Message successfully sent!"
}
```
Description: The message was successfully published to the RabbitMQ queue.

### Bad Request (400 Bad Request)
```
{
  "status": "BAD_REQUEST",
  "message": "The request must include a non-empty 'message' property in the request body."
}
```
