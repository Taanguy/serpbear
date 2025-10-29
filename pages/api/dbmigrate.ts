import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../database/database';

type MigrationGetResponse = {
   hasMigrations: boolean,
}

type MigrationPostResponse = {
   migrated: boolean,
   erroor?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      await db.sync();
      return getMigrationStatus(req, res);
   }
   if (req.method === 'POST') {
      return migrateDatabase(req, res);
   }
   return res.status(405).json({ error: 'Method not allowed' });
}

const getMigrationStatus = async (req: NextApiRequest, res: NextApiResponse<MigrationGetResponse>) => {
   const sequelize = new Sequelize({ dialect: 'sqlite', storage: './data/database.sqlite', logging: false });
   const umzug = new Umzug({
      migrations: { glob: 'database/migrations/*.js' },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: undefined,
   });
   const migrations = await umzug.pending();
   // console.log('migrations :', migrations);
   // const migrationsExceuted = await umzug.executed();
   return res.status(200).json({ hasMigrations: migrations.length > 0 });
};

const migrateDatabase = async (req: NextApiRequest, res: NextApiResponse<MigrationPostResponse>) => {
   const sequelize = new Sequelize({ dialect: 'sqlite', storage: './data/database.sqlite', logging: false });
   const umzug = new Umzug({
      migrations: { glob: 'database/migrations/*.js' },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: undefined,
   });
   const migrations = await umzug.up();
   console.log('[Updated] migrations :', migrations);
   return res.status(200).json({ migrated: true });
};
