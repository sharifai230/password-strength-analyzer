
import React, { useState, useCallback, useRef } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { uploadAccounts } from '../services/api';

interface AdminDashboardProps {
  isLabMode: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isLabMode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setStatus('idle');
      setMessage('');
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setMessage('Please select a file first.');
      setStatus('error');
      return;
    }
    if (!isLabMode) {
      if (!window.confirm("WARNING: Lab Mode is disabled. You are about to upload real user data. Please confirm you have explicit, legal consent from all individuals whose data is included. Do you want to proceed?")) {
        return;
      }
    }

    setStatus('uploading');
    setMessage('Uploading and processing accounts...');
    try {
      const result = await uploadAccounts(file);
      setStatus('success');
      setMessage(result.message);
      setFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  }, [file, isLabMode]);

  const getStatusColor = () => {
    switch(status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'uploading': return 'text-blue-300';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Admin Dashboard</h2>
        <p className="mt-4 text-lg text-gray-400">Upload synthetic or consented account data for audit.</p>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upload Account Data</h3>
          <p className="text-sm text-gray-400 mb-4">
            Upload a CSV or JSON file containing user data. For this demo, please use the format: 
            <code className="text-xs bg-gray-900 p-1 rounded-md mx-1">username,password</code> (CSV) or 
            <code className="text-xs bg-gray-900 p-1 rounded-md mx-1">[{`"username": "...", "password": "..."`}]</code> (JSON).
          </p>

          {!isLabMode && (
             <div className="my-4 p-3 bg-yellow-900 border border-yellow-600 rounded-lg text-yellow-200 text-sm">
               <strong>Responsibility Reminder:</strong> Lab Mode is OFF. You are legally responsible for ensuring you have consent for any data you upload.
             </div>
          )}

          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv, application/json"
              className="block w-full text-sm text-gray-400
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-600 file:text-white
                         hover:file:bg-blue-700"
            />
            {file && <p className="mt-4 text-gray-300">Selected file: {file.name}</p>}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <Button onClick={handleUpload} disabled={!file || status === 'uploading'}>
              {status === 'uploading' ? <Spinner /> : 'Upload & Process Data'}
            </Button>
            {message && <p className={`text-sm font-medium ${getStatusColor()}`}>{message}</p>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
