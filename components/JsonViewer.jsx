import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Copy, Check, Download, ExternalLink } from 'lucide-react';

/**
 * JSON Viewer Component
 * Handles importing and displaying JSON data with proper text overflow
 * Specifically designed for Chrome history and similar data
 */
export default function JsonViewer({ onClose }) {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setJsonData(data);
        setError(null);
      } catch (err) {
        setError('Invalid JSON file. Please upload a valid JSON file.');
        setJsonData(null);
      }
    };
    reader.readAsText(file);
  };

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      setJsonData(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON in clipboard. Please copy valid JSON data.');
      setJsonData(null);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Download as JSON
  const downloadJson = () => {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Detect Chrome history format
  const isChromeHistory = jsonData &&
    jsonData['Browser History'] &&
    Array.isArray(jsonData['Browser History']);

  // Filter items based on search
  const getFilteredItems = () => {
    if (!isChromeHistory) return [];

    const items = jsonData['Browser History'];
    if (!searchTerm) return items;

    return items.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.url?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="fixed inset-0 bg-black/95 z-[5000] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">JSON Data Viewer</h1>
            <p className="text-secondary text-sm">
              Import and view JSON data (Chrome History, any JSON file)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {jsonData && (
              <>
                <button
                  onClick={downloadJson}
                  className="flex items-center gap-2 px-4 py-2 glass hover:border-accent transition-colors rounded-full"
                >
                  <Download size={16} />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={() => setJsonData(null)}
                  className="flex items-center gap-2 px-4 py-2 glass hover:border-accent transition-colors rounded-full"
                >
                  <X size={16} />
                  <span className="text-sm">Clear</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full glass hover:border-accent transition-colors flex items-center justify-center"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {!jsonData && (
          <div className="max-w-2xl mx-auto">
            <div className="glass p-12 rounded-2xl text-center">
              <Upload size={64} className="mx-auto mb-6 text-accent" />

              <h2 className="text-2xl font-bold mb-4">Import JSON Data</h2>
              <p className="text-secondary mb-8">
                Upload a JSON file or paste from clipboard
              </p>

              <div className="flex flex-col gap-4">
                <label className="btn-luxury cursor-pointer inline-block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  Upload JSON File
                </label>

                <button
                  onClick={handlePaste}
                  className="btn-glass"
                >
                  Paste from Clipboard
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"
                >
                  {error}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Chrome History View */}
        {isChromeHistory && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="glass p-4 rounded-xl">
              <input
                type="text"
                placeholder="Search by title or URL..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-lg"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass p-4 rounded-xl">
                <div className="text-2xl font-bold text-accent">
                  {jsonData['Browser History'].length}
                </div>
                <div className="text-sm text-secondary">Total Items</div>
              </div>
              <div className="glass p-4 rounded-xl">
                <div className="text-2xl font-bold text-accent">
                  {filteredItems.length}
                </div>
                <div className="text-sm text-secondary">Filtered</div>
              </div>
            </div>

            {/* History Items */}
            <div className="space-y-3">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={`${item.url}-${item.time_usec || index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="glass p-4 rounded-xl hover:border-accent transition-colors"
                  >
                    {/* Title */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-truncate-2 flex-1">
                        {item.title || 'Untitled'}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.url && (
                          <>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full hover:bg-white/10 transition-colors"
                              title="Open URL"
                            >
                              <ExternalLink size={16} />
                            </a>
                            <button
                              onClick={() => copyToClipboard(item.url, `url-${index}`)}
                              className="p-2 rounded-full hover:bg-white/10 transition-colors"
                              title="Copy URL"
                            >
                              {copied === `url-${index}` ? (
                                <Check size={16} className="text-accent" />
                              ) : (
                                <Copy size={16} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* URL */}
                    {item.url && (
                      <div className="mb-2">
                        <code className="text-xs text-secondary bg-black/30 px-2 py-1 rounded block text-truncate">
                          {item.url}
                        </code>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {item.timestamp_msec && (
                        <span className="px-2 py-1 bg-white/5 rounded">
                          {new Date(item.timestamp_msec).toLocaleString()}
                        </span>
                      )}
                      {item.page_transition && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-truncate">
                          {item.page_transition}
                        </span>
                      )}
                      {item.favicon_url && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded flex items-center gap-1">
                          <img
                            src={item.favicon_url}
                            alt=""
                            className="w-3 h-3"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <span className="text-truncate">Favicon</span>
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredItems.length === 0 && searchTerm && (
                <div className="text-center py-12 text-secondary">
                  No results found for "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generic JSON View */}
        {jsonData && !isChromeHistory && (
          <div className="glass p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">JSON Data</h2>
              <button
                onClick={() => copyToClipboard(JSON.stringify(jsonData, null, 2), 'json')}
                className="flex items-center gap-2 px-4 py-2 glass hover:border-accent transition-colors rounded-full"
              >
                {copied === 'json' ? (
                  <>
                    <Check size={16} />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm text-break">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
