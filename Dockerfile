FROM node:18.16.0
WORKDIR /usr/src/react-and-ai-api
COPY ./ ./
RUN npm install
CMD ["/bin/sh"]
