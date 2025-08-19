/*
	Simple DB connectivity check using Prisma Client.
	Usage: node check-db.js
*/
const { PrismaClient } = require('@prisma/client')

async function main() {
	const prisma = new PrismaClient({ log: ['error', 'warn'] })
	try {
		const users = await prisma.user.count()
		console.log('DB OK. user.count =', users)
	} catch (err) {
		console.error('DB check failed:', err?.message || err)
		process.exitCode = 1
	} finally {
		await prisma.$disconnect()
	}
}

main()
