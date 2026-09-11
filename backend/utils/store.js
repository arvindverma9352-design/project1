const fs = require('fs/promises');
const path = require('path');

const STORE_PATH = path.join(__dirname, '..', 'data', 'store.json');

async function ensureStore() {
  try {
    await fs.access(STORE_PATH);
  } catch (error) {
    const defaultData = {
      users: [],
      products: [],
      orders: []
    };

    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

async function readStore() {
  await ensureStore();

  const raw = await fs.readFile(STORE_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeStore(data) {
  await ensureStore();
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  readStore,
  writeStore,
  STORE_PATH
};
