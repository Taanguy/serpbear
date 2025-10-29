import { Sequelize } from 'sequelize-typescript';
import BetterSqlite3 from 'better-sqlite3';
import Domain from './models/domain';
import Keyword from './models/keyword';

const connection = new Sequelize({
   dialect: 'sqlite',
   host: '0.0.0.0',
   database: 'sequelize',
   dialectModule: BetterSqlite3,
   pool: {
      max: 5,
      min: 0,
      idle: 10000,
   },
   logging: false,
   models: [Domain, Keyword],
   storage: './data/database.sqlite',
});

export default connection;
