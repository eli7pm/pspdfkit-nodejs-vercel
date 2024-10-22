import type { VercelRequest, VercelResponse } from '@vercel/node'
import { load } from '@pspdfkit/nodejs'
import fs from 'node:fs'
import randomBytes from 'node:crypto'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { name = 'World' } = req.query

  convertToPDF();
  return res.json({
    message: `Hello ${name}!`,
  })
}



async function convertToPDF() {
  const docx = fs.readFileSync('./sample.docx');
  const instance = await load({
    document: docx,
  });
  const buffer= await instance.exportPDF();
  // @ts-ignore
  const name = `converted-${randomBytes(8).toString('hex')}.pdf`
  // @ts-ignore
  fs.writeFileSync(name, Buffer.from(buffer));
  await instance.close();
};


