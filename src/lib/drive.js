// Google Drive backup: connects via Google Identity Services (OAuth) and
// uploads a copy of each downloaded ZIP to the user's Drive. Uses the
// narrow drive.file scope — it can only touch files it created itself.

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const TOKEN_KEY = 'logolegacy.drive-token';
const ON_KEY = 'logolegacy.drive-on';

export function isDriveConfigured() {
  return CLIENT_ID.includes('apps.googleusercontent.com');
}

export function driveEnabled() {
  return isDriveConfigured() && localStorage.getItem(ON_KEY) === '1';
}

export function setDriveEnabled(on) {
  localStorage.setItem(ON_KEY, on ? '1' : '0');
}

let gsiPromise = null;
function loadGsi() {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (!gsiPromise) {
    gsiPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.onload = resolve;
      s.onerror = () => {
        gsiPromise = null;
        reject(new Error('Could not load Google sign-in.'));
      };
      document.head.appendChild(s);
    });
  }
  return gsiPromise;
}

function saveToken(resp) {
  sessionStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ t: resp.access_token, exp: Date.now() + (Number(resp.expires_in || 3600) - 60) * 1000 })
  );
}

export function connectDrive() {
  return new Promise((resolve, reject) => {
    loadGsi()
      .then(() => {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (resp) => {
            if (resp.error || !resp.access_token) return reject(new Error(resp.error || 'Google sign-in failed.'));
            saveToken(resp);
            setDriveEnabled(true);
            resolve(resp.access_token);
          },
          error_callback: (err) => reject(new Error(err?.message || 'Google sign-in failed.')),
        });
        client.requestAccessToken();
      })
      .catch(reject);
  });
}

function cachedToken() {
  try {
    const raw = JSON.parse(sessionStorage.getItem(TOKEN_KEY));
    if (raw && raw.exp > Date.now()) return raw.t;
  } catch {
    /* ignore */
  }
  return null;
}

export async function backupZipToDrive(blob, filename) {
  let token = cachedToken();
  if (!token) token = await connectDrive();
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify({ name: filename })], { type: 'application/json' }));
  form.append('file', blob);
  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) throw new Error(`Drive upload failed (${res.status}).`);
  return true;
}
