const { PrismaClient } = require('./generated/prisma');
const argon2 = require('argon2');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Mot de passe de test : "TestUser123!"
    const hashedPassword = await argon2.hash('TestUser123!');
    
    const testUser = await prisma.user.create({
      data: {
        email: 'test@banque.fr',
        password: hashedPassword,
        role: 'RES',
        firstName: 'Test',
        lastName: 'Utilisateur'
      }
    });
    
    console.log('Utilisateur de test créé avec succès :');
    console.log('Email: test@banque.fr');
    console.log('Mot de passe: TestUser123!');
    console.log('Rôle: RES');
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Utilisateur déjà existant');
    } else {
      console.error('Erreur lors de la création:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
