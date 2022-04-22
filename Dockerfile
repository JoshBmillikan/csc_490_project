# syntax=docker/dockerfile:1
FROM node:12.18.1 as node
ENV NODE_ENV=production
COPY . .
RUN npm install --production
RUN npm run build
FROM golang:1.17
COPY . .
ENV GIN_MODE=release
RUN cd src/server/ && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o app .
COPY --from=node /build/ ./www
EXPOSE 8080
CMD ["./src/server/app"]