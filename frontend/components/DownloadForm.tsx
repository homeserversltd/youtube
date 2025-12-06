import React, { useState } from 'react';
import { DownloadResult } from '../types';

interface DownloadFormProps {
  onDownload: (url: string, audioOnly?: boolean) => Promise<DownloadResult>;
  isLoading?: boolean;
}

export const DownloadForm: React.FC<DownloadFormProps> = ({
  onDownload,
  isLoading = false
}) => {
  const [url, setUrl] = useState('');
  const [audioOnly, setAudioOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsDownloading(true);
    try {
      const result = await onDownload(url, audioOnly);
      if (result.success) {
        setSuccess(`Download started: ${result.title || 'Video'}`);
        setUrl('');
        setAudioOnly(false);
      } else {
        setError(result.error || 'Download failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="download-form">
      <h3>Download Video</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="youtube-url">YouTube URL</label>
          <input
            id="youtube-url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={isDownloading || isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="download-audio-only">
            <input
              id="download-audio-only"
              type="checkbox"
              checked={audioOnly}
              onChange={(e) => setAudioOnly(e.target.checked)}
              disabled={isDownloading || isLoading}
            />
            <span>Audio only (download as MP3)</span>
          </label>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button
          type="submit"
          disabled={isDownloading || isLoading || !url.trim()}
          className="download-button"
        >
          {isDownloading ? 'Downloading...' : 'Download'}
        </button>
      </form>
    </div>
  );
};

