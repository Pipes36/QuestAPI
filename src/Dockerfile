FROM node:14
WORKDIR /app
# COPY package.json package.json
# COPY yarn.lock yarn.lock
COPY . .
RUN yarn
EXPOSE 3000
CMD ["yarn", "start"]
