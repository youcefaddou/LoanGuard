const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

// Récupérer toutes les alertes d'un pret specifique
exports.getAlertsByLoan = async (req, res) => {
    const { loanId } = req.params
    try {
        const alerts = await prisma.alert.findMany({
            where: { loanId: parseInt(loanId)},
            orderBy: { date: 'desc'}
        })
        res.json(alerts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des alertes.' })
    }
}

// récuperer toutes les alertes de la banque
exports.getAllAlerts = async (req, res) => {
    const bankId = req.headers['x-bank-id']
    try {
        const alerts = await prisma.alert.findMany({
            include: {
                loan: {
                    include: {
                        company: true
                    }
                }
            },
            where: {
                loan: {
                    bankId: parseInt(bankId)
                }
            },
            orderBy: { date: 'desc' }
        })

        res.json(alerts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des alertes.' })
    }
}

//créer une nouvelle alerte
exports.createAlert = async (req, res) => {
    const { loanId, type, message } = req.body

    try {
        const newAlert = await prisma.alert.create({
            data: {
                loanId: parseInt(loanId),
                type,
                message,
                date: new Date()
            }
        })
        res.status(201).json({
            message: "Alerte créée avec succès",
            alert: newAlert
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'alerte.' })
    }
}

