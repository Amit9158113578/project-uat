FROM node:12.18.2
ARG environment
ENV stage $environment
LABEL MedTrans Go, Inc
RUN echo $environment
RUN mkdir -p /usr/medtransgo-webservices
COPY ./dist/ /usr/medtransgo-webservices/
COPY package.json /usr/medtransgo-webservices/
COPY ecosystem.config.js /usr/medtransgo-webservices/
RUN ls /usr/medtransgo-webservices
WORKDIR /usr/medtransgo-webservices
RUN npm install --production
RUN npm install pm2 -g
CMD pm2 start --env $stage --no-daemon