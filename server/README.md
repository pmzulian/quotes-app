# Create quotes_app database
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