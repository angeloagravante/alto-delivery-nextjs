/*
	Remove test stores/products for the current database.
	DANGER: This deletes all stores and products.
	Usage: node cleanup-db.js
*/
const { PrismaClient } = require('@prisma/client')

async function main() {
	const prisma = new PrismaClient({ log: ['error', 'warn'] })
	try {
		const delProducts = await prisma.product.deleteMany({})
		const delStores = await prisma.store.deleteMany({})
		console.log('Deleted products:', delProducts.count, 'Deleted stores:', delStores.count)
	} catch (err) {
		console.error('Cleanup failed:', err?.message || err)
		process.exitCode = 1
	} finally {
		await prisma.$disconnect()
	}
}

main()
