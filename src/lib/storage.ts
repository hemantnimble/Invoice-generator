export async function uploadFile(
  file: File,
  type: "logo" | "signature"
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    console.error("Upload failed");
    return null;
  }

  const data = await res.json();
  return data.url ?? null;
}