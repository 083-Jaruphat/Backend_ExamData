import db from '../configs/db-config.js'
import { AppError } from '../middlewares/error-handler.js'
import httpStatus from 'http-status'

const TABLE_NAME = 'products'
const ENTITY_NAME = 'Product'

const COUNT_ALL = `SELECT COUNT(*) as total FROM ${TABLE_NAME}`
const FIND_ALL_SQL = `SELECT * FROM ${TABLE_NAME}`
// JOIN ตาราง brands เพื่อดึง brand_name มาแสดงใน Detail DTO ตามโจทย์
const FIND_ONE_SQL = `
    SELECT p.*, b.name AS brand_name 
    FROM ${TABLE_NAME} p 
    LEFT JOIN brands b ON p.brand_id = b.id 
    WHERE p.id = ?
`
const FIND_BY_SKU_SQL = `SELECT * FROM ${TABLE_NAME} WHERE sku = ?`
const UPDATE_SQL = `UPDATE ${TABLE_NAME} SET ? WHERE id = ?`
const REMOVE_SQL = `DELETE FROM ${TABLE_NAME} WHERE id = ?`
const CREATE_SQL = `INSERT INTO ${TABLE_NAME} SET ?`

async function count() {
  const [[{ total }]] = await db.query(COUNT_ALL)
  return total
}

export async function findAll(pagination) {
  if (!pagination) {
    const [rows] = await db.query(FIND_ALL_SQL)
    return rows
  }
  const SQL = FIND_ALL_SQL + ' LIMIT ? OFFSET ?'
  const { limit, offset } = pagination
  const [rows] = await db.query(SQL, [limit, offset])
  rows.totalItems = await count()
  return rows
}

export async function findOne(id) {
  const [row] = await db.query(FIND_ONE_SQL, [id])
  if (row.length === 0) {
    throw new AppError(
      `${ENTITY_NAME} with id '${id}' was not found`,
      httpStatus.NOT_FOUND,
    )
  }
  return row[0]
}

export async function update(id, data) {
  await findOne(id)
  await db.query(UPDATE_SQL, [data, id])
  return findOne(id)
}

export async function remove(id) {
  await findOne(id)
  const [data] = await db.query(REMOVE_SQL, [id])
  return data
}

export async function create(data) {
  // ตรวจสอบว่ามี SKU ซ้ำหรือไม่ (ถ้าซ้ำส่ง 409 Conflict ตามโจทย์)
  if (data.sku) {
    const [existingItem] = await db.query(FIND_BY_SKU_SQL, [data.sku])
    if (existingItem.length !== 0) {
      throw new AppError(
        `Product with SKU '${data.sku}' already exists`,
        httpStatus.CONFLICT,
      )
    }
  }

  // บันทึกข้อมูลและใช้ result.insertId ดึงข้อมูลที่เพิ่งสร้างกลับมา
  const [result] = await db.query(CREATE_SQL, [data])
  return findOne(result.insertId)
}
