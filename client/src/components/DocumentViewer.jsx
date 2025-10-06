import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, ExternalLink, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, X, Award, Briefcase, GraduationCap, AlertCircle, RefreshCw
} from 'lucide-react';
import documentService from '../services/documentService';

export default function DocumentViewer({ documents: initialDocuments = [] }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  // Load documents from API on component mount
  useEffect(() => {
    loadDocuments();
  }, []);

  // Reset loading state when document changes
  useEffect(() => {
    setIsLoading(true);
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedDoc]);

  const loadDocuments = async () => {
    setLoadingDocuments(true);
    setError(null);
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
      if (docs.length > 0 && !selectedDoc) {
        setSelectedDoc(docs[0]);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError('Failed to load documents. Please try again.');
      // Fallback to initial documents if API fails
      if (initialDocuments.length > 0) {
        setDocuments(initialDocuments);
        setSelectedDoc(initialDocuments[0]);
      }
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleSelectDoc = (doc) => {
    setSelectedDoc(doc);
    setPage(1);
    setZoom(100);
  };

  const handleDownload = async (doc) => {
    try {
      await documentService.downloadDocument(doc.id);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download document. Please try again.');
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  // Get icon based on document type or content
  const getDocumentIcon = (doc) => {
    if (doc.title.includes('Resume')) return <Briefcase className="w-5 h-5" />;
    if (doc.title.includes('Certificate')) return <Award className="w-5 h-5" />;
    if (doc.title.includes('GATE') || doc.title.includes('Scorecard')) return <GraduationCap className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full">
      {/* Floating toggle button for mobile */}
      <motion.button
        className="fixed bottom-4 left-4 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X /> : <FileText />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {(showSidebar || window.innerWidth > 768) && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="col-span-12 md:col-span-3 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg p-4 space-y-4 border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">Documents Library</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={loadDocuments}
                disabled={loadingDocuments}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                title="Refresh documents"
              >
                <RefreshCw className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${loadingDocuments ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  className={`cursor-pointer rounded-lg transition-all duration-300 border overflow-hidden ${
                    selectedDoc?.id === doc.id
                      ? 'ring-2 ring-blue-500 border-blue-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-4 ${
                    selectedDoc?.id === doc.id
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        selectedDoc?.id === doc.id 
                          ? 'bg-white/20' 
                          : 'bg-blue-100 dark:bg-gray-700'
                      }`}>
                        {getDocumentIcon(doc)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{doc.title}</h4>
                        <p className={`text-sm truncate ${
                          selectedDoc?.id === doc.id 
                            ? 'text-blue-100' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>{doc.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 transform origin-left scale-x-0 transition-transform duration-300" 
                      style={{ 
                        transform: selectedDoc?.id === doc.id ? 'scaleX(1)' : 'scaleX(0)'
                      }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Viewer */}
      <motion.div 
        layout
        className={`${showSidebar ? 'col-span-12 md:col-span-9' : 'col-span-12'} bg-white dark:bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full`}
      >
        {selectedDoc ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={selectedDoc.id}
                  className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
                >
                  {selectedDoc.title}
                </motion.h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedDoc.description}
                </p>
              </div>
              
              <div className="flex gap-2 self-end sm:self-auto">
                {/* Document Controls */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shadow-inner">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 50}
                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-sm">{zoom}%</span>
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 200}
                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
                
                <a
                  href={selectedDoc.downloadUrl || selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </a>
                <button
                  onClick={() => handleDownload(selectedDoc)}
                  className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors"
                  title="Download document"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Document Display Area */}
            <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
              {/* Loading overlay */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-200/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-10"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading document...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Document iframe with zoom control */}
              <div className="flex-1 overflow-auto">
                <div style={{ 
                  transform: `scale(${zoom/100})`, 
                  transformOrigin: 'top center',
                  height: zoom > 100 ? `${zoom}%` : '100%',
                  width: zoom > 100 ? `${zoom}%` : '100%',
                  transition: 'transform 0.2s ease'
                }}>
                  <iframe
                    src={`${selectedDoc.url}#page=${page}`}
                    className="w-full h-full border-0"
                    title={selectedDoc.title}
                    onLoad={() => setIsLoading(false)}
                  ></iframe>
                </div>
              </div>
              
              {/* Page navigation controls */}
              <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={page <= 1}
                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                    <span className="text-sm font-medium">Page {page}</span>
                  </div>
                  <button
                    onClick={handleNextPage}
                    className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDoc.type}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <FileText className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg">Select a document to view</p>
            <p className="text-sm mt-2">Browse the document library on the left</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}