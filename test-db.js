/*
	Creates a temp user, store, and product, then lists products.
	Usage: node test-db.js
*/
const { PrismaClient } = require('@prisma/client')

async function main() {
	const prisma = new PrismaClient({ log: ['error', 'warn'] })
	try {
		const clerkId = 'test_user_123'
		const user = await prisma.user.upsert({
			where: { clerkId },
			update: {},
			create: { clerkId, email: 'test@example.com', name: 'Test User' },
		})

		const store = await prisma.store.create({
			data: {
				name: 'Test Store',
				description: 'A store for testing',
				storeType: 'General',
				village: 'TestVille',
				phaseNumber: '1',
				blockNumber: 'A',
				lotNumber: '1',
				userId: user.id,
			}
		})

		const product = await prisma.product.create({
			data: {
				name: 'Test Product',
				description: 'A product for testing',
				price: 9.99,
				category: 'Misc',
				stock: 10,
				imageUrl: '',
				storeId: store.id,
			}
		})

		const products = await prisma.product.findMany({
			where: { storeId: store.id },
			include: { store: { select: { id: true, name: true } } },
		})
		console.log('Created product id:', product.id)
		console.log('Products for store:', products.map(p => ({ id: p.id, name: p.name, store: p.store?.name })))
	} catch (err) {
		console.error('Test failed:', err?.message || err)
		process.exitCode = 1
	} finally {
		await prisma.$disconnect()
	}
}

main()
