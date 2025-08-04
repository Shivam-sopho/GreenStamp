import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.nGOMember.deleteMany()
  await prisma.proof.deleteMany()
  await prisma.user.deleteMany()
  await prisma.nGO.deleteMany()
  await prisma.category.deleteMany()

  // Create sample NGOs
  const ngo1 = await prisma.nGO.create({
    data: {
      name: 'Eco Warriors',
      description: 'Dedicated to protecting the environment through community action',
      email: 'contact@ecowarriors.org',
      website: 'https://ecowarriors.org',
      phone: '+1-555-0123',
      address: '123 Green Street, Eco City, EC 12345',
      totalProofs: 15,
      totalMembers: 45,
      totalImpact: 150,
      isVerified: true,
    },
  })

  const ngo2 = await prisma.nGO.create({
    data: {
      name: 'Tree Planters United',
      description: 'Planting trees for a greener future',
      email: 'info@treeplanters.org',
      website: 'https://treeplanters.org',
      phone: '+1-555-0456',
      address: '456 Forest Avenue, Green Town, GT 67890',
      totalProofs: 28,
      totalMembers: 67,
      totalImpact: 280,
      isVerified: true,
    },
  })

  const ngo3 = await prisma.nGO.create({
    data: {
      name: 'Ocean Cleanup Crew',
      description: 'Cleaning our oceans one beach at a time',
      email: 'hello@oceancleanup.org',
      website: 'https://oceancleanup.org',
      phone: '+1-555-0789',
      address: '789 Beach Road, Coastal City, CC 11111',
      totalProofs: 42,
      totalMembers: 89,
      totalImpact: 420,
      isVerified: true,
    },
  })

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Smith',
      walletAddress: '0x1234567890abcdef',
      bio: 'Environmental activist and tree lover',
      totalProofs: 8,
      totalImpact: 80,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      walletAddress: '0xabcdef1234567890',
      bio: 'Marine biologist passionate about ocean conservation',
      totalProofs: 12,
      totalImpact: 120,
    },
  })

  // Create NGO memberships
  await prisma.nGOMember.create({
    data: {
      userId: user1.id,
      ngoId: ngo1.id,
      role: 'admin',
    },
  })

  await prisma.nGOMember.create({
    data: {
      userId: user2.id,
      ngoId: ngo2.id,
      role: 'member',
    },
  })

  // Create sample categories
  await prisma.category.create({
    data: {
      name: 'tree_planting',
      description: 'Planting trees and reforestation activities',
      icon: '🌳',
      color: '#22c55e',
      totalProofs: 25,
    },
  })

  await prisma.category.create({
    data: {
      name: 'beach_cleanup',
      description: 'Cleaning beaches and coastal areas',
      icon: '🏖️',
      color: '#3b82f6',
      totalProofs: 18,
    },
  })

  await prisma.category.create({
    data: {
      name: 'recycling',
      description: 'Recycling and waste management activities',
      icon: '♻️',
      color: '#f59e0b',
      totalProofs: 12,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`Created ${3} NGOs, ${2} users, and ${3} categories`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 