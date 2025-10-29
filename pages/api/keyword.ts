import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../database/database';
import Keyword from '../../database/models/keyword';
import parseKeywords from '../../utils/parseKeywords';

type KeywordGetResponse = {
   keyword?: KeywordType | null
   error?: string|null,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      await db.sync();
      return getKeyword(req, res);
   }
   return res.status(405).json({ error: 'Method not allowed' });
}

const getKeyword = async (req: NextApiRequest, res: NextApiResponse<KeywordGetResponse>) => {
   if (!req.query.id && typeof req.query.id !== 'string') {
       return res.status(400).json({ error: 'Keyword ID is Required!' });
   }

   try {
      const query = { ID: parseInt((req.query.id as string), 10) };
      const foundKeyword:Keyword| null = await Keyword.findOne({ where: query });
      const pareseKeyword = foundKeyword && parseKeywords([foundKeyword.get({ plain: true })]);
      const keywords = pareseKeyword && pareseKeyword[0] ? pareseKeyword[0] : null;
      return res.status(200).json({ keyword: keywords });
   } catch (error) {
      console.log('[ERROR] Getting Keyword: ', error);
      return res.status(400).json({ error: 'Error Loading Keyword' });
   }
};
