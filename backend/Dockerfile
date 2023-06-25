FROM node:20-bullseye-slim
WORKDIR /backend
COPY package.json /backend/package.json
COPY package-lock.json /backend/package-lock.json
RUN npm i
COPY . ./