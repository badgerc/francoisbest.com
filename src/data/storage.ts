import fs from 'fs'
import path from 'path'
import mkdirp from 'make-dir'
import type { Services } from './services'
import { FETCHLIST_PATHS, SERVICE_DIRS } from './paths'

export function readServiceFetchlist(service: Services) {
  const fetchlistPath = FETCHLIST_PATHS[service]
  try {
    const buffer = fs.readFileSync(fetchlistPath, 'utf-8')
    const contentIDs = buffer.split('\n').filter(line => line.length > 0)
    return contentIDs
  } catch (error) {
    // File not found is an expected error.
    if (error.code !== 'ENOENT') {
      console.error(error)
    }
    return []
  }
}

export function store<T>(service: Services, contentID: string, data: T) {
  const json = JSON.stringify(data, null, 2)
  const body = `module.exports = ${json}`
  const serviceDir = SERVICE_DIRS[service]
  const filePath = path.resolve(serviceDir, `${contentID}.ts`)
  mkdirp.sync(path.dirname(filePath))
  fs.writeFileSync(filePath, body)
}
