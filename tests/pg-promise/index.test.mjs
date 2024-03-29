import pgpromise from 'pg-promise';
import pgvector from 'pgvector/pg-promise';

test('example', async () => {
  const initOptions = {
    async connect(e) {
      await pgvector.registerType(e.client);
    }
  };
  const pgp = pgpromise(initOptions);
  const db = pgp({database: 'pgvector_node_test'});

  await db.none('CREATE EXTENSION IF NOT EXISTS vector');
  await db.none('DROP TABLE IF EXISTS pg_promise_items');
  await db.none('CREATE TABLE pg_promise_items (id serial PRIMARY KEY, embedding vector(3))');

  const params = [
    pgvector.toSql([1, 1, 1]),
    pgvector.toSql([2, 2, 2]),
    pgvector.toSql([1, 1, 2]),
    null
  ];
  await db.none('INSERT INTO pg_promise_items (embedding) VALUES ($1), ($2), ($3), ($4)', params);

  const items = await db.any('SELECT * FROM pg_promise_items ORDER BY embedding <-> $1 LIMIT 5', [pgvector.toSql([1, 1, 1])]);
  expect(items.map(v => v.id)).toStrictEqual([1, 3, 2, 4]);
  expect(items[0].embedding).toStrictEqual([1, 1, 1]);
  expect(items[1].embedding).toStrictEqual([1, 1, 2]);
  expect(items[2].embedding).toStrictEqual([2, 2, 2]);

  await db.none('CREATE INDEX ON pg_promise_items USING hnsw (embedding vector_l2_ops)');

  await pgp.end();
});
