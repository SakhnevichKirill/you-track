<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Hard deadline value refresh using values from "Start date" and "Original esimation" (in my case: "Hard interval").
Soft deadline refresh using ratio 75% ratio of Original esimation
Stage refresh using Hard deadline

## Installation

```bash
$ npm install
```
Create file .development.env and add:
```bash
TOKEN="perm:your-token"
BASE_URL="http://example.myjetbrains.com"
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```