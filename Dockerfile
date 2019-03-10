FROM node:8
WORKDIR /app
COPY ./dist .
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn install --production
EXPOSE 3000
ENV NODE_ENV=production
# Start the server
CMD ["node", "."]