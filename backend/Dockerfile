FROM node:16-alpine3.14 

LABEL version="1.0"
LABEL description=""
LABEL maintainer=["htan116@e.ntu.edu.sg"]

WORKDIR /usr/src/app/server

COPY package.json .

RUN npm install --quiet

EXPOSE 2000

COPY . .

CMD ["node", "server.js"]
