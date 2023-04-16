# zeply-api

This is a docker image from [node](https://hub.docker.com/_/node) used for zeply project.

## Usage

### Build image

```bash
docker build --tag zeply-api .
```

### Start a new API instance

```bash
docker run --name zeply-api \
  -p <PORT>:8080 \
  -d zeply-api
```
