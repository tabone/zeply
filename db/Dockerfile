# USAGE: docker run --name zeply-db \
# -p <PORT>:5432 \
# -v <HOST-DIR>:/var/lib/postgresql/data \
# -d zeply-db

FROM postgres:15.2

LABEL maintainer='taboneluca3@gmail.com'

ENV POSTGRES_DB=zeply
ENV POSTGRES_USER=leeroy
ENV POSTGRES_PASSWORD=jenkins

COPY ./data/a-setup.sql /docker-entrypoint-initdb.d/
COPY ./data/b-data.sql /docker-entrypoint-initdb.d/
