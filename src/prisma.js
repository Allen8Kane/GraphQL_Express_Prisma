const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.users.findUnique({
        where: {
            id:1
        }
    })
    console.log(user);
}

main().catch( e => {
    throw e
}).finally(async () => {
    await prisma.$disconnect()
})