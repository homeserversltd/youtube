import React, { useState, useEffect } from 'react';
import { YoutubeSettings } from '../types';

interface DownloadSettingsProps {
  settings: YoutubeSettings;
  onUpdate: (settings: Partial<YoutubeSettings>) => Promise<void>;
  isLoading?: boolean;
}

export const DownloadSettings: React.FC<DownloadSettingsProps> = ({
  settings,
  onUpdate,
  isLoading = false
}) => {
  const [quality, setQuality] = useState(settings.quality);
  const [format, setFormat] = useState(settings.format);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setQuality(settings.quality);
    setFormat(settings.format);
  }, [settings]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    setIsSaving(true);
    try {
      await onUpdate({ quality, format });
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="download-settings">
      <h3>Download Settings</h3>
      
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="default-quality">Default Quality</label>
          <select
            id="default-quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={isSaving || isLoading}
          >
            <option value="best">Best Available</option>
            <option value="bestvideo+bestaudio">Best Video + Audio</option>
            <option value="worst">Worst Available</option>
            <option value="bestvideo">Best Video Only</option>
            <option value="bestaudio">Best Audio Only</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="default-format">Default Format</label>
          <input
            id="default-format"
            type="text"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            placeholder="bestvideo+bestaudio"
            disabled={isSaving || isLoading}
          />
          <small>Format string used for subscription downloads (e.g., &quot;bestvideo[height&lt;=1080]+bestaudio&quot;)</small>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="save-button"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

