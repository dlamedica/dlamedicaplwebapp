export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
}

const API_BASE = 'https://www.googleapis.com/drive/v3/files';

export async function listFilesInFolder(folderId: string, apiKey: string): Promise<DriveFile[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
  const fields = encodeURIComponent('files(id,name,mimeType,modifiedTime,size,webViewLink,webContentLink,iconLink)');
  const url = `${API_BASE}?q=${q}&key=${apiKey}&fields=${fields}&pageSize=1000&supportsAllDrives=true&includeItemsFromAllDrives=true`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google Drive API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return (data.files || []) as DriveFile[];
}

export function directDownloadUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

