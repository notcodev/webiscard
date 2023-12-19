export function getImageUrl(filename: string) {
  return `${import.meta.env.VITE_API_URL}/images/${filename}`
}
