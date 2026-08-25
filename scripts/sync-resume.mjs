import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultSource = resolve(projectRoot, '..', 'Resume', 'public', 'resume');
const explicitSource = process.argv[2] ? resolve(process.argv[2]) : null;
const sourceRoot = explicitSource ? dirname(explicitSource) : defaultSource;
const destinationRoot = resolve(projectRoot, 'public');
const artifacts = [
  ['andy-kumeda-resume.pdf', 'pdf'],
  ['andy-kumeda-resume.docx', 'DOCX'],
  ['andy-kumeda-resume.md', 'Markdown'],
];

await mkdir(dirname(resolve(destinationRoot, artifacts[0][0])), { recursive: true });

for (const [filename, label] of artifacts) {
  const source = label === 'pdf' && explicitSource ? explicitSource : resolve(sourceRoot, filename);
  const destination = resolve(destinationRoot, filename);
  if (label === 'pdf') {
    const header = (await readFile(source)).subarray(0, 5).toString('ascii');
    if (header !== '%PDF-') throw new Error(`Not a PDF: ${source}`);
  }
  await copyFile(source, destination);
  console.log(`Updated ${destination} from ${source}`);
}
