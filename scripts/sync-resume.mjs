import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultSource = resolve(projectRoot, '..', 'Resume', 'public', 'resume', 'andy-kumeda-resume.pdf');
const source = resolve(process.argv[2] || defaultSource);
const destination = resolve(projectRoot, 'public', 'andy-kumeda-resume.pdf');

const header = (await readFile(source)).subarray(0, 5).toString('ascii');
if (header !== '%PDF-') throw new Error(`Not a PDF: ${source}`);

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
console.log(`Updated ${destination} from ${source}`);
