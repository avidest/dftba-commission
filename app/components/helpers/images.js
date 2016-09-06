import Path from 'path'

export function getSize(src, size = '100x') {
  let ext = Path.extname(src)
  let base = src.replace(ext, '')
  return `${base}_${size}${ext}`
}