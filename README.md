# Banckend
## Create quotes_app database
Previous to run server.js, create the quotes_app database:
```bash
mysql -u user -p password
```
```bash
CREATE DATABASE quotes_app;
```
```bash
SHOW DATABASES;
```
## Run Banckend server
This command will veriry if the database exists and proceed to create the table if it does no exist
```bash
npm run dev;
```
# Frontend
## Run Frontend Server
```bash
npm run dev;
```
## Run Frontend Test
```bash
npm run test;
```
# Run from root folder
> Run concurrently Frontend and Backend
> ```bash
> npm run dev
> ```
## Run Frontend
```bash
npm run client;
```
## Run Backend
```bash
npm run server;
```

### Backend endpoints

The API provides the following endpoints:

1. GET ->  `/api/listAll` -> Retrieve all quotes from the database
2. POST -> `/api/addQuote` -> Create a new quote. Requires JSON body with `description`, `author` and optional `favorite`
3. PUT -> `/api/:id` -> Update an existing quote by ID. Requires JSON body with fields to update
4. DELETE -> `/api/:id` -> Delete a quote by ID

#### Example Requests

**Get all quotes**
```bash
GET http://localhost:4000/api/listAll
```

**Add new quote**
```bash
POST http://localhost:4000/api/addQuote
Content-Type: application/json

{
  "description": "Your quote text",
  "author": "Quote Author",
  "favorite": false
}
```

**Update quote**
```bash
PUT http://localhost:4000/api/1
Content-Type: application/json

{
  "description": "Updated quote text",
  "author": "Updated Author",
  "favorite": true
}
```

**Delete quote**
```bash
DELETE http://localhost:4000/api/1
```