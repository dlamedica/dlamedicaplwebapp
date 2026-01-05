import React, { useEffect, useState } from 'react';
import { FaDownload, FaExternalLinkAlt, FaFileAlt } from 'react-icons/fa';
import { listFilesInFolder, directDownloadUrl, DriveFile } from '../../services/googleDriveService';

interface EducationalMaterialsProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  folderId?: string; // optional override
  apiKey?: string;   // optional override
}

const EducationalMaterials: React.FC<EducationalMaterialsProps> = ({ darkMode, fontSize, folderId, apiKey }) => {
  const [files, setFiles] = useState<DriveFile[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const envFolderId = import.meta.env.VITE_EDU_MATERIALS_FOLDER_ID as string | undefined;
  const envApiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY as string | undefined;
  const resolvedFolder = folderId || envFolderId;
  const resolvedKey = apiKey || envApiKey;

  useEffect(() => {
    const load = async () => {
      if (!resolvedFolder || !resolvedKey) return; // pokażemy instrukcje poniżej
      try {
        setLoading(true);
        const data = await listFilesInFolder(resolvedFolder, resolvedKey);
        // sort by name
        data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setFiles(data);
      } catch (e: any) {
        setError(e.message || 'Błąd podczas pobierania listy plików z Google Drive');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [resolvedFolder, resolvedKey]);

  const font = fontSize === 'small' ? 'text-sm' : fontSize === 'large' ? 'text-lg' : 'text-base';

  if (!resolvedFolder || !resolvedKey) {
    return (
      <div className={`rounded-lg p-6 border ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-200 bg-white text-gray-900'}`}>
        <h3 className={`font-semibold mb-2 ${font}`}>Materiały edukacyjne</h3>
        <p className={`${font} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Aby włączyć pobieranie materiałów, podaj w konfiguracji:
        </p>
        <ul className={`${font} list-disc ml-6 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <li><code>VITE_GOOGLE_DRIVE_API_KEY</code> — klucz API do Google Drive (dostęp publiczny do folderu).</li>
          <li><code>VITE_EDU_MATERIALS_FOLDER_ID</code> — ID udostępnionego folderu na Google Drive.</li>
        </ul>
        <p className={`${font} mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Możesz też przekazać jednorazowo link/ID i klucz — powiedz, a wprowadzę je za Ciebie.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <p className={font}>Ładowanie materiałów…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg p-6 border ${darkMode ? 'border-red-700 bg-gray-800 text-white' : 'border-red-200 bg-white text-gray-900'}`}>
        <p className={`${font} text-red-500`}>Błąd: {error}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <h3 className={`font-semibold mb-4 ${font}`}>Darmowe materiały edukacyjne</h3>
      {(!files || files.length === 0) ? (
        <p className={`${font} ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Brak plików w folderze.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map(file => (
            <div key={file.id} className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <FaFileAlt className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <div className={`font-medium ${font}`}>{file.name}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {(file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('pl-PL') : '')}
                      {file.size ? ` • ${(Number(file.size) / (1024*1024)).toFixed(2)} MB` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`}
                    target="_blank" rel="noopener noreferrer"
                    className="px-3 py-2 rounded text-sm flex items-center"
                    style={{ backgroundColor: '#e5e7eb', color: '#111827' }}
                  >
                    <FaExternalLinkAlt className="mr-2" /> Podgląd
                  </a>
                  <a 
                    href={file.webContentLink || directDownloadUrl(file.id)}
                    className="px-3 py-2 rounded text-sm flex items-center text-black"
                    style={{ backgroundColor: '#38b6ff' }}
                  >
                    <FaDownload className="mr-2" /> Pobierz
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationalMaterials;

