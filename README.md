# pgvector-node

[pgvector](https://github.com/ankane/pgvector) support for Node.js

Supports [Sequelize](https://github.com/sequelize/sequelize), [node-postgres](https://github.com/brianc/node-postgres), and [pg-promise](https://github.com/vitaly-t/pg-promise)

[![Build Status](https://github.com/ankane/pgvector-node/workflows/build/badge.svg?branch=master)](https://github.com/ankane/pgvector-node/actions)

## Installation

Run:

```sh
npm install pgvector
```

And follow the instructions for your database library:

- [Sequelize](#sequelize)
- [node-postgres](#node-postgres)
- [pg-promise](#pg-promise)

## Sequelize

Register the type

```js
const { Sequelize } = require('sequelize');
const pgvector = require('pgvector/sequelize');

pgvector.registerType(Sequelize);
```

Add a vector field

```js
Item.init({
  factors: {
    type: DataTypes.VECTOR(3)
  }
}, ...);
```

Insert a vector

```js
await Item.create({factors: [1, 2, 3]});
```

Get the nearest neighbors to a vector

```js
const items = await Item.findAll({
  order: [sequelize.literal(`factors <-> '[1, 2, 3]'`)],
  limit: 5
});
```

## node-postgres

Register the type

```js
const pgvector = require('pgvector/pg');

await pgvector.registerType(client);
```

Insert a vector

```js
const factors = [1, 2, 3];
await client.query('INSERT INTO items (factors) VALUES ($1)', [pgvector.toSql(factors)]);
```

Get the nearest neighbors to a vector

```js
const result = await client.query('SELECT * FROM items ORDER BY factors <-> $1 LIMIT 5', [pgvector.toSql(factors)]);
```

## pg-promise

Register the type

```js
const pgvector = require('pgvector/pg');

const initOptions = {
  async connect(client, dc, useCount) {
    await pgvector.registerType(client);
  }
};
const pgp = require('pg-promise')(initOptions);
```

Insert a vector

```js
const factors = [1, 2, 3];
await db.none('INSERT INTO items (factors) VALUES ($1)', [pgvector.toSql(factors)]);
```

Get the nearest neighbors to a vector

```js
const result = await db.any('SELECT * FROM items ORDER BY factors <-> $1 LIMIT 5', [pgvector.toSql(factors)]);
```

## History

View the [changelog](https://github.com/ankane/pgvector-node/blob/master/CHANGELOG.md)

## Contributing

Everyone is encouraged to help improve this project. Here are a few ways you can help:

- [Report bugs](https://github.com/ankane/pgvector-node/issues)
- Fix bugs and [submit pull requests](https://github.com/ankane/pgvector-node/pulls)
- Write, clarify, or fix documentation
- Suggest or add new features

To get started with development:

```sh
git clone https://github.com/ankane/pgvector-node.git
cd pgvector-node
npm install
createdb pgvector_node_test
npm test
```
