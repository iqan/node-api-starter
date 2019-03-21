# node-api-starter
A starter template for nodejs-expressjs-mongodb api

## Pre-requisites
- NodeJS
- MongoDB
- Docker (optional)
- Docker-Compose (optional)

## Get started

### To Run App
- Install dependencies
```
npm i
```
- Run app
```
npm run
```

### Docker steps
- Build Docker image
```
docker build -t <some-fency-name> .
```
- Run docker container
```
docker run -it --name <name-of-container> <some-fency-name>
```
- To stop
```
docker stop <name-of-container>
```

### Docker compose steps
- Build images
```
docker-compose build
```
- run all containers
```
docker-compose up -it
```
- To stop
```
docker-compose down
```

## Basic routes:
- For healthcheck: http://localhost:3000/api/v1/healthcheck
- For Swagger specs: http://localhost:3000/api/v1/api-specs/