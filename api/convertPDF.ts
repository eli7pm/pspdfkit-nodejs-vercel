import type { VercelRequest, VercelResponse } from '@vercel/node'
import { load } from '@pspdfkit/nodejs'
import fs from 'node:fs'
import randomBytes from 'node:crypto'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const name = await convertToPDF()

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
  const file = fs.createWriteStream(name, Buffer.from(buffer));
  file.on("finish", () => {
    file.close();
    console.log("Download Completed");
  });
  await instance.close();
  return name
}


