export async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string; width: number; height: number; format: string }> {
  const sigRes = await fetch('/api/upload/signature', { method: 'POST' });
  if (!sigRes.ok) throw new Error('Failed to get upload signature');

  const { signature, timestamp, cloudName, apiKey, folder } = await sigRes.json();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));
  formData.append('api_key', apiKey);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Upload failed');
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}
