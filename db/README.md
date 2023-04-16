# zeply-db

This is a docker image from [postgress](https://hub.docker.com/_/postgres) used for zeply project.

## Usage

### Build image

```bash
docker build --tag zeply-db .
```

### Start a new DB instance

```bash
docker run --name zeply-db \
  -p <PORT>:5432 \
  -v <HOST-DIR>:/var/lib/postgresql/data \
  -d zeply-db
```

### Default DB Credentials

| Credential    | Value     |
| ------------- | --------- |
| Database Name | `zeply`   |
| Username      | `leeroy`  |
| Password      | `jenkins` |
