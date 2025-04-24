import bcrypt from 'bcrypt'
import { PrismaClient, Role } from './generated/prisma-client';

const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password: await bcrypt.hash('Admin@123', 10),
            role: Role.ADMIN,
        },
    })

    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            password: await bcrypt.hash('User@123', 10),
            role: Role.USER,
        },
    })

    console.log('Seeded users:', { admin, user })
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e)
        prisma.$disconnect()
        process.exit(1)
    })
