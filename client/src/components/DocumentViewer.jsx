import React, { useState } from 'react';
import { FileText, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DocumentViewer({ documents }) {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);
  const [page, setPage] = useState(1);

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
    setPage(1);
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Sidebar */}
      <div className="col-span-3 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 space-y-4 border border-gray-200 dark:border-gray-700">
        {documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => handleSelectDoc(doc)}
            className={`w-full p-3 rounded-lg flex items-center gap-2 transition-colors border ${
              selectedDoc?.id === doc.id
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>{doc.title}</span>
          </button>
        ))}
      </div>

      {/* Viewer */}
      <div className="col-span-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
        {selectedDoc ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedDoc.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedDoc.description}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
                <a
                  href={selectedDoc.url}
                  download
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
              </div>
            </div>
            <div className="flex-1 flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <iframe
                src={`${selectedDoc.url}#page=${page}`}
                className="w-full h-full rounded"
                title={selectedDoc.title}
              ></iframe>
            </div>
     
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a document to view.
          </div>
        )}
      </div>
    </div>
  );
}
