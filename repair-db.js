/*
  Repair orphaned references in the database (MongoDB via Prisma).
  - Detect stores referencing missing users
  - Detect products referencing missing stores
  - Detect orders referencing missing users/stores
  - Detect order items referencing missing orders

  Usage:
    node repair-db.js           # Dry run (no changes)
    node repair-db.js apply     # Apply fixes (delete orphans)
*/

const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient({ log: ['error', 'warn'] })
  const apply = process.argv[2] === 'apply'
  const results = { dryRun: !apply, actions: [] }

  try {
    const users = await prisma.user.findMany({ select: { id: true, clerkId: true } })
    const userIds = new Set(users.map(u => u.id))

    const stores = await prisma.store.findMany({ select: { id: true, userId: true, name: true } })
    const storeIds = new Set(stores.map(s => s.id))

    const orphanStores = stores.filter(s => !userIds.has(s.userId))
    if (orphanStores.length) {
      results.actions.push({ type: 'orphan-stores', count: orphanStores.length, ids: orphanStores.map(s => s.id) })
      if (apply) {
        const del = await prisma.store.deleteMany({ where: { id: { in: orphanStores.map(s => s.id) } } })
        results.actions.push({ type: 'deleted-stores', count: del.count })
      }
    }

    // Refresh store ids after potential deletion
    const storesAfter = apply ? await prisma.store.findMany({ select: { id: true } }) : stores
    const storeIdSet = new Set(storesAfter.map(s => s.id))

    const products = await prisma.product.findMany({ select: { id: true, storeId: true, name: true } })
    const orphanProducts = products.filter(p => !storeIdSet.has(p.storeId))
    if (orphanProducts.length) {
      results.actions.push({ type: 'orphan-products', count: orphanProducts.length, ids: orphanProducts.map(p => p.id) })
      if (apply) {
        const del = await prisma.product.deleteMany({ where: { id: { in: orphanProducts.map(p => p.id) } } })
        results.actions.push({ type: 'deleted-products', count: del.count })
      }
    }

    // Orders
    const orders = await prisma.order.findMany({ select: { id: true, userId: true, storeId: true, orderNumber: true } })
    const orphanOrders = orders.filter(o => !userIds.has(o.userId) || !storeIdSet.has(o.storeId))
    if (orphanOrders.length) {
      results.actions.push({ type: 'orphan-orders', count: orphanOrders.length, ids: orphanOrders.map(o => o.id) })
      if (apply) {
        // Delete order items first
        const delItems = await prisma.orderItem.deleteMany({ where: { orderId: { in: orphanOrders.map(o => o.id) } } })
        const delOrders = await prisma.order.deleteMany({ where: { id: { in: orphanOrders.map(o => o.id) } } })
        results.actions.push({ type: 'deleted-order-items', count: delItems.count })
        results.actions.push({ type: 'deleted-orders', count: delOrders.count })
      }
    }

    // Order items
    const orderIdsAfter = new Set((apply ? await prisma.order.findMany({ select: { id: true } }) : orders).map(o => o.id))
    const items = await prisma.orderItem.findMany({ select: { id: true, orderId: true } })
    const orphanItems = items.filter(it => !orderIdsAfter.has(it.orderId))
    if (orphanItems.length) {
      results.actions.push({ type: 'orphan-order-items', count: orphanItems.length, ids: orphanItems.map(i => i.id) })
      if (apply) {
        const del = await prisma.orderItem.deleteMany({ where: { id: { in: orphanItems.map(i => i.id) } } })
        results.actions.push({ type: 'deleted-orphan-items', count: del.count })
      }
    }

    console.log(JSON.stringify(results, null, 2))
  } catch (err) {
    console.error('Repair failed:', err?.message || err)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()
