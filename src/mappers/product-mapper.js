// src/mappers/product-mapper.js
export default class ProductMapper {
  // 1. แปลงเป็น Summary DTO สำหรับ GET /api/67130500004/products
  static toSummaryDTO(entity) {
    if (!entity) return null
    return {
      id: entity.id,
      sku: entity.sku,
      name: entity.name,
      brandId: entity.brand_id ?? entity.brandId,
      category: entity.category,
      price: Number(entity.price),
      status: entity.status,
    }
  }

  // 2. แปลงเป็น Detail DTO สำหรับ GET /api/67130500004/products/:id
  static toDetailDTO(entity) {
    if (!entity) return null
    return {
      id: entity.id,
      sku: entity.sku,
      name: entity.name,
      brandId: entity.brand_id ?? entity.brandId,
      brandName: entity.brand_name ?? entity.brandName,
      category: entity.category,
      price: Number(entity.price),
      ramGb: entity.ram_gb ?? entity.ramGb,
      storageGb: entity.storage_gb ?? entity.storageGb,
      color: entity.color,
      stockQuantity: entity.stock_quantity ?? entity.stockQuantity,
      status: entity.status,
      releaseDate: entity.release_date ?? entity.releaseDate,
    }
  }

  // แปลงข้อมูลรายการเดียว
  static map(entity, viewType = 'full') {
    if (!entity) return null
    if (viewType === 'summary') {
      return this.toSummaryDTO(entity)
    }
    return this.toDetailDTO(entity)
  }

  // แปลงข้อมูลหลายรายการ (Array)
  static maps(entities, viewType = 'summary') {
    if (!Array.isArray(entities)) return []
    const { totalItems } = entities

    const entitiesMap = entities.map((item) =>
      viewType === 'full' ? this.toDetailDTO(item) : this.toSummaryDTO(item),
    )

    if (totalItems !== undefined) {
      entitiesMap.totalItems = totalItems
    }
    return entitiesMap
  }
}
