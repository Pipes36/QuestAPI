FROM node:14
WORKDIR /app
COPY . .
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN npm install
RUN yarn
EXPOSE 3000
CMD ["yarn", "start"]
