require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserStatus() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    
    if (!adminEmail) {
      console.error('❌ ADMIN_EMAIL environment variable not set');
      return;
    }

    console.log(`🔍 Checking user status for: ${adminEmail}`);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (!user) {
      console.error(`❌ No user found with email: ${adminEmail}`);
      return;
    }
    
    console.log(`✅ User Details:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Onboarded: ${user.onboarded}`);
    console.log(`   Clerk ID: ${user.clerkId}`);
    
    if (user.role !== 'ADMIN') {
      console.log('🔧 Updating role to ADMIN...');
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'ADMIN' }
      });
      console.log('✅ Role updated to ADMIN');
    }
    
    if (!user.onboarded) {
      console.log('🔧 Setting onboarded to true...');
      await prisma.user.update({
        where: { id: user.id },
        data: { onboarded: true }
      });
      console.log('✅ User marked as onboarded');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserStatus();
