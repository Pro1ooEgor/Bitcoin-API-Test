# Bitcoin Node Rest APIs documentation

Requires [Node.js](https://nodejs.org/) v10+ and MongoDB to run.

Create env file and update below variable
```sh
PORT=5000
MONGODB_URL={YOUR_MONGODB_CONNECTION_URI}
```

Install the dependencies and and start the node server.

```sh
cd BitcoinNode
npm i
npm start
```

Run the project in the browser
```sh
127.0.0.1:5000
```

# Note
If 5000 port is not available please follow below addition step

Go to libs/swagger.yaml and update the port value on line number 7. PORT value must me same for the .env and libs/swagger.yaml file.