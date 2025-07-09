const { PrismaClient } = require('../generated/prisma');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Création des utilisateurs de test...');
    
    // Mot de passe commun pour tous les utilisateurs de test
    const hashedPassword = await argon2.hash('Testpass123!');
    
    // Vérifier si des banques existent (créées par createTestBanks)
    const banques = await prisma.bank.findMany();
    if (banques.length === 0) {
      console.log(' Aucune banque trouvée. Exécutez d\'abord createTestBanks.js');
      return;
    }
    
    // 1. Créer un RES avec accès à plusieurs banques
    const resMulti = await prisma.user.create({
      data: {
        email: 'res.multi@test.com',
        password: hashedPassword,
        role: 'RES',
        firstName: 'Pierre',
        lastName: 'Dupont'
      }
    });
    
    // Associer le RES à toutes les banques disponibles
    for (const banque of banques) {
      await prisma.userBank.create({
        data: {
          userId: resMulti.id,
          bankId: banque.id
        }
      });
    }
    
    console.log('RES multi-banques créé:', resMulti.email);
    
    // 2. Créer un RES avec accès à une seule banque
    const resSingle = await prisma.user.create({
      data: {
        email: 'res.single@test.com',
        password: hashedPassword,
        role: 'RES',
        firstName: 'Marie',
        lastName: 'Martin'
      }
    });
    
    // Associer le RES à la première banque uniquement
    await prisma.userBank.create({
      data: {
        userId: resSingle.id,
        bankId: banques[0].id
      }
    });
    
    console.log('RES mono-banque créé:', resSingle.email);
    
    // 3. Créer un CHG lié à une banque spécifique
    const chgUser = await prisma.user.create({
      data: {
        email: 'chg.test@test.com',
        password: hashedPassword,
        role: 'CHG',
        firstName: 'Jean',
        lastName: 'Durand'
      }
    });
    
    // Associer le CHG à la deuxième banque (ou première si une seule)
    const banqueChg = banques.length > 1 ? banques[1] : banques[0];
    await prisma.userBank.create({
      data: {
        userId: chgUser.id,
        bankId: banqueChg.id
      }
    });
    
    console.log('CHG créé:', chgUser.email, '(banque:', banqueChg.name, ')');
    
    // 4. Créer un ADM (pas de banque spécifique)
    const admUser = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'ADM',
        firstName: 'Admin',
        lastName: 'Système'
      }
    });
    
    console.log('ADM créé:', admUser.email);
    
    console.log('\n Tous les utilisateurs de test créés avec succès !');
    console.log('\n Comptes de test disponibles:');
    console.log('1. RES Multi-banques: res.multi@test.com / TestUser123!');
    console.log('2. RES Mono-banque: res.single@test.com / TestUser123!');
    console.log('3. CHG: chg.test@test.com / TestUser123!');
    console.log('4. ADM: admin@test.com / TestUser123!');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log(' Un utilisateur avec cet email existe déjà');
    } else {
      console.error(' Erreur lors de la création:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
