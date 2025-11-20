import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GoogleDriveViewer = ({ fileUrl, fileName, height = "500px" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    if (!fileUrl) {
      setError('URL file tidak valid');
      setIsLoading(false);
      return;
    }

    try {
      // Parse Google Drive URL
      const urlPattern = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/uc\?id=|drive\.google\.com\/open\?id=)([a-zA-Z0-9-_]+)/;
      const match = fileUrl.match(urlPattern);
      
      if (!match) {
        setError('URL Google Drive tidak valid. Pastikan Anda menggunakan link file Google Drive yang benar.');
        setIsLoading(false);
        return;
      }

      const fileId = match[1];
      
      // Create embed URL for different file types
      const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      setEmbedUrl(embedUrl);
      setIsLoading(false);
    } catch (err) {
      setError('Error memproses URL Google Drive');
      setIsLoading(false);
    }
  }, [fileUrl]);

  const getDirectDownloadUrl = () => {
    if (!fileUrl) return '#';
    const urlPattern = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/uc\?id=|drive\.google\.com\/open\?id=)([a-zA-Z0-9-_]+)/;
    const match = fileUrl.match(urlPattern);
    
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return fileUrl;
  };

  const openInNewTab = () => {
    if (!fileUrl) return;
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={openInNewTab}
              className="text-red-600 border-red-300 hover:bg-red-100"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Buka di Google Drive
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={getDirectDownloadUrl}
              className="text-red-600 border-red-300 hover:bg-red-100"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Langsung
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {isLoading ? (
        <div 
          className="flex items-center justify-center bg-gray-100"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Memuat file...</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <iframe
            src={embedUrl}
            className="w-full border-0"
            style={{ height }}
            allowFullScreen
            title={fileName || 'Google Drive File'}
            onLoad={() => setIsLoading(false)}
          />
          
          {/* Overlay untuk accessibility dan user info */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {fileName || 'File Surat'}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {fileName && (
            <span className="truncate max-w-xs" title={fileName}>
              {fileName}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={openInNewTab}
            className="text-blue-600 hover:bg-blue-50"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Buka di Drive
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={getDirectDownloadUrl}
            className="text-green-600 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveViewer;