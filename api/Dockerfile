# USAGE: docker run --name zeply-api \
# -p <PORT>:5432 \
# -d zeply-api

FROM node:18.15

LABEL maintainer='taboneluca3@gmail.com'

WORKDIR /usr/app
COPY ./ /usr/app

RUN npm install --omit=dev

ENV MEMPOOL_HOST="mempool.space"
ENV DB_HOST="db"
ENV DB_PORT=5432
ENV DB_USER="leeroy"
ENV DB_PASSWORD="jenkins"
ENV DB_DATABASE="zeply"

CMD ["node", "index.js"]
EXPOSE 8080
