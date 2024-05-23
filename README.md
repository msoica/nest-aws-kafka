
# Kafka Integration with NestJS


## Project Structure

- `src/`
  - `app.controller.ts` - Defines the API endpoints to send and consume Kafka messages.
  - `app.module.ts` - Main application module.
  - `main.ts` - Entry point of the application.
  - `certs/` - Directory to store SSL certificates.
    - `ca.pem` - CA certificate.
    - `service.cert` - Client certificate.
    - `service.key` - Client key.
  - `kafka/`
    - `kafka.module.ts` - Kafka module definition.
    - `kafka.service.ts` - Kafka service to handle Kafka operations.

## Installation


1. Install the dependencies:
   ```bash
   npm install
   ```

2. Place your SSL certificates in the `src/certs/` directory:
   - `ca.pem`
   - `service.cert`
   - `service.key`

3. Update the Kafka configuration in `src/kafka/kafka.service.ts` with your AWS region, Kafka cluster ARN, and credentials.

## Running the Application

1. Start the NestJS application:
   ```bash
   npm run start
   ```

2. Use a tool like Postman to interact with the API endpoints.

### Sending a Message

- Endpoint: `POST /send`
- Body:
  ```json
  {
    "message": "Hello, Kafka!"
  }
  ```

### Consuming Messages

- Endpoint: `GET /consume`

## License

This project is licensed under the MIT License.
