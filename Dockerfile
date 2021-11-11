FROM node:16.9

RUN npm install -g nodemon

COPY . /app
WORKDIR /app
RUN npm install

ENTRYPOINT [ "node", "/app/src/index.js" ]
