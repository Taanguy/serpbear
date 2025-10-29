import { writeFile } from 'fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next';

type SettingsGetResponse = {
   cleared?: boolean,
   error?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'PUT') {
      return clearFailedQueue(req, res);
   }
   return res.status(502).json({ error: 'Unrecognized Route.' });
}

const clearFailedQueue = async (req: NextApiRequest, res: NextApiResponse<SettingsGetResponse>) => {
   try {
      await writeFile(`${process.cwd()}/data/failed_queue.json`, JSON.stringify([]), { encoding: 'utf-8' });
      return res.status(200).json({ cleared: true });
   } catch (error) {
      console.log('[ERROR] Cleraring Failed Queue File.', error);
      return res.status(200).json({ error: 'Error Cleraring Failed Queue!' });
   }
};
