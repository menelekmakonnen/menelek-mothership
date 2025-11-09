export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const payload = req.body;
  // In a production deployment you would forward this payload to an
  // observability platform. For now we simply log so developers can
  // verify vitals locally without blocking the response.
  // eslint-disable-next-line no-console
  console.log('Web Vitals', payload);
  res.status(200).json({ received: true });
}
