# USAGE: docker run --name zeply-web \
# -p <PORT>:8080 \
# -d zeply-web

FROM node:18.15

LABEL maintainer='taboneluca3@gmail.com'

WORKDIR /usr/app
COPY ./ /usr/app

ENV REACT_APP_API="http://localhost:8080"

RUN npm install -g serve
RUN npm install --omit=dev
RUN npm run build

CMD serve -s ./build -p 8080

EXPOSE 8080
