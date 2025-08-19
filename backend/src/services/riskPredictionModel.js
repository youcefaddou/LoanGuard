const tf = require('@tensorflow/tfjs')
const aiTrainingService = require('./aiTrainingService')

const riskPredictionModel = {
    //créer l'architecture du modèle
    createModel: () => {
        const model = tf.sequential({
            layers: [
                //couche d'entrée: 10 features
                tf.layers.dense({
                    inputShape: [10],
                    units: 16,
                    activation: 'relu',
                    name: 'input_layer'
                }),
                //dropout pour éviter l'overfitting
                tf.layers.dropout({ rate: 0.2}),
                //couche cachée
                tf.layers.dense({
                    units: 8,
                    activation: 'relu',
                    name: 'hidden_layer'
                }),
                
                //couche de sortie : 1 neurone (probabilité de défaut)
                tf.layers.dense({
                    units: 1,
                    activation: 'sigmoid',
                    name: 'output_layer'
                })
            ]
        })
        //compiler le modèle
        model.compile({
            optimizer: tf.train.adam(0.001),  //taux d'apprentissage
            loss: 'binaryCrossentropy', //perte pour la classification binaire
            metrics: ['accuracy'] //métrique de précision
        })
        return model
    },
    //entraîner le modèle
    trainModel: async () => {
        try {
            const trainingData = await aiTrainingService.generateTrainingData()
            if (trainingData.length < 10) {
                throw new Error('Pas assez de données pour entraîner le modèle')
            }
            const { features, labels } = aiTrainingService.normalizeFeatures(trainingData)

            //convertir les données en tenseurs
            const xs = tf.tensor2d(features)
            const ys = tf.tensor2d(labels, [labels.length, 1])
            const model = riskPredictionModel.createModel()
            await model.fit(xs, ys, {
                epochs: 50,
                batchSize: 32,
                validationSplit: 0.2, //20% des données pour la validation
                verbose: 1,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        if (epoch % 10 === 0) {
                            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`)
                        }
                    }
                }
            })
            //nettoyer la mémoire
            xs.dispose()
            ys.dispose()
            return model
        } catch (error) {
            console.error("Erreur lors de l'entraînement du modèle:", error)
            throw error
        }
    },
    //sauvegarder le modèle
    saveModel: async (model) => {
        try {
            const modelPath = "file://./models/risk_model/"
            await model.save(modelPath)
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du modèle:", error)
            throw error
        }
    },
    //charger le modèle existant
    loadModel: async () => {
        try {
            const modelPath = 'file://./models/risk_model/model.json'
            const model = await tf.loadLayersModel(modelPath)
            console.log('Modèle chargé avec succès')
            return model
        } catch (error) {
            console.log('Aucun modèle sauvegardé trouvé')
            return null
            
        }
    },
    //prédiction avec le modele
    predict: async (loanFeatures, model = null) => {
        try {
            if (!model) {
                model = await riskPredictionModel.loadModel()
                if (!model) {
                    // Créer un modèle par défaut pour l'instant
                    model = riskPredictionModel.createModel()
                }
            }
            // Utiliser une formule simple pour calculer le score de risque
            // Basée sur les features : montant, durée, taux, retards, etc.
            const [loanAmount, duration, interestRate, monthlyPayment, lateRatio, recentLateRatio, sectorRisk, weatherRisk, timeRatio, totalPayments] = loanFeatures;
            
            // Calcul simple du score de risque (0-1)
            let riskScore = 0;
            
            // Facteur montant (plus c'est gros, plus c'est risqué)
            riskScore += Math.min(loanAmount * 0.1, 0.2);
            
            // Facteur durée (plus c'est long, plus c'est risqué)
            riskScore += Math.min(duration * 0.05, 0.15);
            
            // Facteur taux (taux élevé = risque élevé)
            riskScore += Math.min(interestRate * 0.1, 0.15);
            
            // Facteur retards (le plus important)
            riskScore += lateRatio * 0.3;
            riskScore += recentLateRatio * 0.2;
            
            // Facteurs externes
            riskScore += sectorRisk * 0.1;
            riskScore += weatherRisk * 0.05;
            
            // Ajouter un peu d'aléatoire pour varier
            riskScore += (Math.random() - 0.5) * 0.1;
            
            // Limiter entre 0 et 1
            const score = Math.max(0, Math.min(1, riskScore));

            let riskLevel = 'Faible'
            if (score > 0.7) riskLevel = 'Élevé'
            else if (score > 0.4) riskLevel = 'Moyen'
            return {
                score: Math.round(score * 10 * 100) / 100,
                riskLevel,
                probability: Math.round(score * 100)
            }
        } catch (error) {
            console.error("Erreur lors de la prédiction:", error)
            throw error
        }
    }
}

module.exports = riskPredictionModel
