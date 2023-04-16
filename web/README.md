# zeply-web

This is a docker image from [node](https://hub.docker.com/_/node) used for zeply project.

## Usage

### Build image

```bash
docker build --tag zeply-web .
```

### Start a new Web instance

```bash
docker run --name zeply-web \
  -p <PORT>:8080 \
  -d zeply-web
```
