const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const generatePaymentHistory = async (loan) => {
    try {
        const payments = []
        let currentDate = new Date(loan.startDate)
        const today = new Date();
        
        // calculer la date de fin théorique du prêt
        const loanEndDate = new Date(loan.dueDate);
        
        //générer les paiements jusqu'à la date la plus proche entre aujourd'hui et la fin du prêt
        const endDate = today < loanEndDate ? today : loanEndDate;
        
        let paymentCount = 0;
        
        while (currentDate <= endDate && paymentCount < loan.duration) {
            //simulation des retards
            const isLate = Math.random() < 0.15
            const daysDelay = isLate ? Math.floor(Math.random() * 10) + 1 : 0
            const paymentDate = new Date(currentDate)
            paymentDate.setDate(paymentDate.getDate() + daysDelay)

            payments.push({
                loanId: loan.id,
                amount: loan.monthlyPayment,
                date: paymentDate,
                status: isLate ? 'LATE' : 'ON_TIME'
            })
            
            //avancer d'un mois
            currentDate.setMonth(currentDate.getMonth() + 1)
            paymentCount++;
        }
        // Enregistrer les paiements dans la base de données
        if (payments.length > 0) {
            await prisma.payment.createMany({
                data: payments
            })
        }
    } catch (error) {
        console.error("Erreur lors de la génération paiements:", error)
    }
}

module.exports = { generatePaymentHistory }