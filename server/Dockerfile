FROM node:18-alpine
WORKDIR /app
COPY package.json . 
RUN npm install
COPY ./dist ./dist
COPY .env .env
EXPOSE 5000 
CMD ["node", "dist/final.cjs"]


