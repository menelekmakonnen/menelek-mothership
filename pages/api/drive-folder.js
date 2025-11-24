import { fetchDriveFolder } from '@/lib/googleDrive';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ error: 'Missing Google Drive folder id' });
    return;
  }

  try {
    const folder = await fetchDriveFolder(id);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    res.status(200).json(folder);
  } catch (error) {
    console.error('Failed to load Google Drive folder', id, error);
    res.status(502).json({ error: 'Unable to load Google Drive folder' });
  }
}
