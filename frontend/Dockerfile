FROM node:20-bullseye-slim
WORKDIR /frontend
ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL ${REACT_APP_BASE_URL}
COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json
RUN npm i
RUN npm i -g serve
COPY . ./
RUN npm run production