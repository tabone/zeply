# Zeply

## Usage

```bash
docker compose up
```

## Introduction

This project uses Docker Compose to manage multiple services. The following services are defined in the `docker-compose.yml` file:

## `db`

This service deploys a PostgreSQL database using the Dockerfile located in the `./db` directory. The database is used to hold BTC address and transaction search history data which is then used by the application to list the most commonly searched BTC addresses and transactions.

> This image is exposing port `5432` to gain access to the DB.

## `api`

This service deploys an ExpressJS REST API using the Dockerfile located in the `./api` directory.

> `npm test` to execute to unit tests.

This API has the following endpoints:

### HTTP GET /health

Retrieves the status of the API Server. Mostly meant for Kubernetes readiness prop functionality.

### HTTP GET /reports/popular-addresses

Retrieves the top 5 most searched BTC Adresses.

### HTTP GET /reports/popular-transactions

Retrieves the top 5 most searched BTC Transactions.

### HTTP GET /rates

Retrieves the current exchange rates the API is using for converting `BTC` to `EUR` & `USD`. These rates are refreshed every 10 mintues.

### HTTP GET /addresses/{id}

Retrieves information about a BTC Address.

### HTTP GET /transactions/{id}

Retrieves information about a BTC Transaction.

> This image is exposing port `8080` to gain access to the API.

## web

This service deploys a ReactJS FE application using the Dockerfile located in the `./web` directory. This container requires the `REACT_APP_API` environment variable. This is used by the ReactJS FE application to connect with th `api` service.

> `npm test` to execute to unit tests.

This FE Application has the following features:

- Users are be able to view the top 5 most searched BTC addresses & transactions.
- Users are be able to search for BTC addresses & transactions by their ID.
- Users are be able to change the currency used to show monetary amounts. Available options are `BTC`, `EUR` and `USD`.
- Users get notified in real-time when a new block is mined.
- Users are be able to subscribe to BTC addresses enabling them to receive real-time notifications (using websockets) whenever a BTC transaction involving the subscribed address occurs. Subscribed BTC Addresses are stored in the local storage.
- Users are be able to subscribe to BTC transactions enabling them to receive real-time notifications (using websockets) whenever the subscribed transaction gets confirmed. Subscribed BTC Transactions are stored in the local storage.
- Users are be able to view the following BTC address details:
  - Confirmed Transactions.
  - BTC Received (in BTC, USD and/or EUR).
  - BTC Spent (in BTC, USD and/or EUR).
  - BTC Unspent (in BTC, USD and/or EUR).
  - Balance (in BTC, USD and/or EUR).
- Users are be able to view the following BTC transaction details:
  - Transaction hash.
  - Time when the BTC Transaction has been confirmed.
  - Status.
  - Size.
  - Number of Confirmations.
  - BTC Input (in BTC, USD and/or EUR).
  - BTC Output (in BTC, USD and/or EUR).
  - Fees (in BTC, USD and/or EUR).

> This image is exposing port `8181` to gain access to the Web app.

## Thank You

Thank you for taking the time to review my project! Let me know if something is unclear.
