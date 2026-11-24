import Dexie, { type Table } from 'dexie';
import type { Stockpile } from './stockpile';

const db = new Dexie('StockpileDatabase') as Dexie & {
    stockpiles: Table<Stockpile>
}
db.version(1).stores({
    stockpiles: 'id, name, gtin, expiryDate, location, quantity, isSynced, updatedAt'
});
export { db }