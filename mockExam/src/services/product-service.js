import * as repo from '../repositories/product-repo.js'
import mapper from '../mappers/product-mapper.js'

export async function getObject(id, viewType = 'full') {
  const entity = await repo.findOne(id)
  return mapper.map(entity, viewType)
}

export async function getAllObjects(pagination, viewType = 'summary') {
  const objects = await repo.findAll(pagination)
  const objectsDto = mapper.maps(objects, viewType)
  return objectsDto
}

export async function updateObject(id, data) {
  const updated = await repo.update(id, data)
  return mapper.map(updated, 'full')
}

export async function removeObject(id) {
  return await repo.remove(id)
}

export async function createObject(data) {
  const created = await repo.create(data)
  return mapper.map(created, 'full')
}
