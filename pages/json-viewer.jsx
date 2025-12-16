import { useState } from 'react';
import { useRouter } from 'next/router';
import JsonViewer from '@/components/JsonViewer';

/**
 * JSON Viewer Page
 * Standalone page for viewing Chrome history and other JSON data
 */
export default function JsonViewerPage() {
  const router = useRouter();

  return <JsonViewer onClose={() => router.push('/')} />;
}
