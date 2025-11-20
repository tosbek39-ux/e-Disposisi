import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GoogleDriveInput = ({ value, onChange, placeholder = "Masukkan URL Google Drive file...", label = "File Surat", required = false }) => {
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!value) {
      setIsValid(false);
      setError('');
      return;
    }

    setIsChecking(true);
    setError('');

    // Validate Google Drive URL pattern
    const urlPattern = /(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/uc\?id=|drive\.google\.com\/open\?id=)([a-zA-Z0-9-_]+)/;
    const isValidUrl = urlPattern.test(value);

    if (!isValidUrl) {
      setIsValid(false);
      setError('URL tidak valid. Pastikan Anda menggunakan link Google Drive yang benar.');
    } else {
      setIsValid(true);
      setError('');
    }
    
    setIsChecking(false);
  }, [value]);

  const getValidationIcon = () => {
    if (isChecking) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    }
    if (isValid) {
      return <Check className="w-4 h-4 text-green-600" />;
    }
    if (error) {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const openInGoogleDrive = () => {
    if (value) {
      window.open(value, '_blank', 'noopener,noreferrer');
    }
  };

  const extractFileName = () => {
    if (!value) return '';
    try {
      const url = new URL(value);
      return decodeURIComponent(url.searchParams.get('name') || '');
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
        {getValidationIcon()}
      </Label>
      
      <div className="relative">
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-10 ${isValid ? 'border-green-300 focus:border-green-500' : error ? 'border-red-300 focus:border-red-500' : ''}`}
          required={required}
        />
        
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={openInGoogleDrive}
            title="Buka di Google Drive"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {isValid && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
          ✓ URL Google Drive valid
          {extractFileName() && (
            <div className="mt-1">
              <span className="font-medium">File: </span>
              <span>{extractFileName()}</span>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <strong>Cara mendapatkan URL Google Drive:</strong>
        <ol className="mt-1 list-decimal list-inside space-y-1">
          <li>Klik kanan pada file di Google Drive</li>
          <li>Pilih "Share" atau "Bagikan"</li>
          <li>Atur permission menjadi "Anyone with the link can view"</li>
          <li>Copy link yang diberikan</li>
        </ol>
      </div>
    </div>
  );
};

export default GoogleDriveInput;