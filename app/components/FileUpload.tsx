'use client';

import { useState } from 'react';
import { Upload, X, FileText, Globe, Loader } from 'lucide-react';

interface FileUploadProps {
  onClose: () => void;
}

export default function FileUpload({ onClose }: FileUploadProps) {
  const [uploadType, setUploadType] = useState<'pdf' | 'web'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage("Sorry! select a valid PDF file.");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setMessage('');
  };

  const handleUpload = async () => {
    if (uploadType === 'pdf' && !file) {
      setMessage('Please select a PDF file.');
      return;
    }
    if (uploadType === 'web' && !url.trim()) {
      setMessage('Please enter a valid URL.');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      if (uploadType === 'pdf' && file) {
        formData.append('file', file);
        formData.append('type', 'pdf');
      } else if (uploadType === 'web' && url) {
        formData.append('url', url);
        formData.append('type', 'web');
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Content uploaded successfully! You can now ask questions about it.');
        if (uploadType === 'pdf') setFile(null);
        if (uploadType === 'web') setUrl('');
      } else {
        setMessage(data.message || 'Upload failed. Please try again.');
      }
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Add New Content</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setUploadType('pdf')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            uploadType === 'pdf'
              ? 'bg-primary-100 text-primary-700 border border-primary-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>PDF Upload</span>
        </button>
        <button
          onClick={() => setUploadType('web')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            uploadType === 'web'
              ? 'bg-primary-100 text-primary-700 border border-primary-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Web Page</span>
        </button>
      </div>

      {uploadType === 'pdf' ? (
        <div className="upload-area">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {file ? file.name : 'Click to select PDF file'}
            </span>
          </label>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
            Web Page URL
          </label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com/page"
            className="chat-input"
          />
        </div>
      )}

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={isUploading || (uploadType === 'pdf' && !file) || (uploadType === 'web' && !url.trim())}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isUploading ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
