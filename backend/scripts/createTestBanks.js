// Script pour créer des données de test avec agences multiples
const { PrismaClient } = require('../generated/prisma');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function createTestBanks() {
  try {
    console.log('Création des données de test avec agences multiples');

    // 1. Créer les 3 agences BNP Paribas
    const bank1 = await prisma.bank.create({
      data: {
        name: 'BNP Paribas - Marseille Chave',
        address: '71 Boulevard Chave',
        zipCode: '13005',
        city: 'Marseille'
      }
    });

    const bank2 = await prisma.bank.create({
      data: {
        name: 'BNP Paribas - Marseille Saint Barnabé',
        address: '125 Avenue de Saint Barnabé',
        zipCode: '13012',
        city: 'Marseille'
      }
    });

    const bank3 = await prisma.bank.create({
      data: {
        name: 'BNP Paribas - Allauch',
        address: '386 Boulevard Henri Tasso',
        zipCode: '13190',
        city: 'Allauch'
      }
    });

    const bank4 = await prisma.bank.create({
      data: {
        name: 'BNP Paribas - Aubagne',
        address: '1 Avenue Jeanne D\'arc',
        zipCode: '13400',
        city: 'Aubagne'
      }
    });
    console.log('Agences BNP créées:', bank1.name, bank2.name, bank3.name, bank4.name);

    // 2. Créer un RES avec plusieurs agences
    const hashedPassword = await argon2.hash('Testpass123!');
    
    const resUser = await prisma.user.create({
      data: {
        email: 'res.multiagence@test.com',
        password: hashedPassword,
        firstName: 'Pierre',
        lastName: 'Dupont',
        role: 'RES'
      }
    });
    console.log(' RES créé:', resUser.firstName, resUser.lastName);

    // 4. Associer le RES à plusieurs agences
    await prisma.userBank.createMany({
      data: [
        { userId: resUser.id, bankId: bank1.id },
        { userId: resUser.id, bankId: bank2.id },
        { userId: resUser.id, bankId: bank3.id }
      ]
    });
    console.log('RES associé aux 3 agences');

    // 3. Créer un RES avec une seule agence
    const resSingleUser = await prisma.user.create({
      data: {
        email: 'res.single@test.com',
        password: hashedPassword,
        firstName: 'Marie',
        lastName: 'Martin',
        role: 'RES'
      }
    });

    await prisma.userBank.create({
      data: {
        userId: resSingleUser.id,
        bankId: bank4.id
      }
    });
    console.log('RES avec une seule agence créé');

    // 4. Créer un CHG (pas d'agences spécifiques)
    const chgUser = await prisma.user.create({
      data: {
        email: 'chg.test@test.com',
        password: hashedPassword,
        firstName: 'Jean',
        lastName: 'Durand',
        role: 'CHG'
      }
    });
    console.log('CHG créé:', chgUser.firstName, chgUser.lastName);

    console.log('\n Données de test créées avec succès !');
    console.log('\n Comptes de test:');
    console.log('1. RES Multi-agences: res.multiagence@test.com / Testpass123!!')
    console.log('2. RES Mono-agence: res.single@test.com / Testpass123!!')
    console.log('3. CHG: chg.test@test.com / Testpass123!!')

  } catch (error) {
    console.error(' Erreur création données test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script
if (require.main === module) {
  createTestBanks()
}

module.exports = { createTestBanks }
