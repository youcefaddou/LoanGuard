// Script pour mettre à jour l'association du RES mono à la nouvelle banque Aubagne
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function updateResSingleBank() {
  try {
    console.log('Mise à jour de l\'association RES mono vers Aubagne');

    // 1. Trouver l'utilisateur RES mono
    const resUser = await prisma.user.findFirst({
      where: { email: 'res.single@test.com' }
    });

    if (!resUser) {
      console.log('Utilisateur RES mono non trouvé');
      return;
    }

    // 2. Trouver la banque Aubagne
    const aubagneBank = await prisma.bank.findFirst({
      where: { name: 'BNP Paribas - Aubagne' }
    });

    if (!aubagneBank) {
      console.log('Banque Aubagne non trouvée');
      return;
    }

    // 3. Supprimer l'ancienne association
    await prisma.userBank.deleteMany({
      where: { userId: resUser.id }
    });

    // 4. Créer la nouvelle association avec Aubagne
    await prisma.userBank.create({
      data: {
        userId: resUser.id,
        bankId: aubagneBank.id
      }
    });

    console.log(`RES ${resUser.firstName} ${resUser.lastName} maintenant associé à ${aubagneBank.name}`);
    
  } catch (error) {
    console.error('Erreur mise à jour:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateResSingleBank();
