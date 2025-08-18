const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-') // Replace multiple consecutive dashes with single dash
    .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes
}

export default normalizeString
