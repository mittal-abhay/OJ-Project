FROM node:18-alpine
WORKDIR /app
RUN apk update && apk add --no-cache gcc
RUN apk update && apk add --no-cache g++
RUN apk update && apk add --no-cache python3 py3-pip
RUN apk update && apk add --no-cache openjdk17
COPY package.json . 
RUN npm i
COPY . . 
EXPOSE 8000
CMD ["node", "index.js"]

