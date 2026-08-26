import { SiteEditor } from '../site-editor';
import { notFound } from 'next/navigation';

export default function EditorPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <SiteEditor />;
}
