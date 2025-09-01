const tf = require('@tensorflow/tfjs')
const path = require('path')
const fs = require('fs')
const aiTrainingService = require('./aiTrainingService')

const riskPredictionModel = {
    //créer l'architecture du modèle
    createModel: () => {
        console.log('Création du modèle de réseau de neurones...')
        const model = tf.sequential({
            layers: [
                //couche d'entrée: retour à 24 neurones (compromis)
                tf.layers.dense({
                    inputShape: [10],
                    units: 24,        // 24 au lieu de 32
                    activation: 'relu',
                    name: 'input_layer'
                }),
                //dropout réduit
                tf.layers.dropout({ rate: 0.2}),  // Retour à 0.2
                
                //une seule couche cachée optimisée
                tf.layers.dense({
                    units: 12,
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
            optimizer: tf.train.adam(0.0003),  // Learning rate intermédiaire
            loss: 'binaryCrossentropy', //perte pour la classification binaire
            metrics: ['accuracy'] //métrique de précision
        })
        
        console.log('Modèle créé avec succès')
        return model
    },

    //entraîner le modèle
    trainModel: async () => {
        try {
            console.log('=== DEBUT ENTRAINEMENT MODELE IA ===')
            
            const trainingData = await aiTrainingService.generateTrainingData()
            if (trainingData.length < 5) {
                throw new Error('Pas assez de données pour entraîner le modèle (minimum 5 prêts)')
            }
            
            console.log(`Données d'entraînement: ${trainingData.length} échantillons`)
            const { features, labels } = aiTrainingService.normalizeFeatures(trainingData)

            //convertir les données en tenseurs
            const xs = tf.tensor2d(features)
            const ys = tf.tensor2d(labels, [labels.length, 1])
            
            console.log(`Tenseurs créés - Features: ${xs.shape}, Labels: ${ys.shape}`)
            
            const model = riskPredictionModel.createModel()
            
            console.log('Début de l\'entraînement...')
            const history = await model.fit(xs, ys, {
                epochs: 200,  // Réduit à 200
                batchSize: Math.min(24, Math.floor(trainingData.length / 6)),  // Batch intermédiaire
                validationSplit: 0.2,
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
            
            console.log('Entraînement terminé, sauvegarde des poids...')
            await riskPredictionModel.saveModelWeights(model)
            
            // Statistiques finales
            const finalLoss = history.history.loss[history.history.loss.length - 1]
            const finalAccuracy = history.history.acc[history.history.acc.length - 1]
            
            console.log('=== ENTRAINEMENT TERMINE ===')
            console.log(`Précision finale: ${(finalAccuracy * 100).toFixed(2)}%`)
            console.log(`Loss finale: ${finalLoss.toFixed(4)}`)
            
            return {
                model,
                accuracy: finalAccuracy,
                loss: finalLoss,
                epochs: history.history.loss.length
            }
        } catch (error) {
            console.error("Erreur lors de l'entraînement du modèle:", error)
            throw error
        }
    },

    // Sauvegarder les poids en JSON
    saveModelWeights: async (model) => {
        try {
            console.log('Sauvegarde des poids du modèle...')
            
            // Créer le dossier ai_models s'il n'existe pas
            const modelsDir = path.join(process.cwd(), 'ai_models')
            if (!fs.existsSync(modelsDir)) {
                fs.mkdirSync(modelsDir, { recursive: true })
                console.log('Dossier ai_models créé')
            }
            
            // Extraire les poids du modèle
            const weights = model.getWeights()
            const weightsData = []
            
            for (let i = 0; i < weights.length; i++) {
                const weightTensor = weights[i]
                const weightArray = await weightTensor.data()
                weightsData.push({
                    name: model.layers[Math.floor(i/2)].name || `layer_${Math.floor(i/2)}`,
                    type: i % 2 === 0 ? 'kernel' : 'bias',
                    shape: weightTensor.shape,
                    data: Array.from(weightArray)
                })
            }
            
            // Créer la structure du modèle
            const modelStructure = {
                version: '1.0.0',
                savedAt: new Date().toISOString(),
                architecture: {
                    inputShape: [10],
                    layers: [
                        { type: 'dense', units: 16, activation: 'relu', name: 'input_layer' },
                        { type: 'dropout', rate: 0.2 },
                        { type: 'dense', units: 8, activation: 'relu', name: 'hidden_layer' },
                        { type: 'dense', units: 1, activation: 'sigmoid', name: 'output_layer' }
                    ]
                },
                weights: weightsData,
                optimizer: 'adam',
                loss: 'binaryCrossentropy',
                learningRate: 0.001
            }
            
            // Sauvegarder en JSON
            const modelPath = path.join(modelsDir, 'risk-model.json')
            fs.writeFileSync(modelPath, JSON.stringify(modelStructure, null, 2))
            
            console.log(`Modèle sauvegardé dans: ${modelPath}`)
            
            // Nettoyer la mémoire
            weights.forEach(w => w.dispose())
            
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du modèle:", error)
            throw error
        }
    },

    // Charger depuis les poids JSON
    loadModelFromWeights: async () => {
        try {
            console.log('Tentative de chargement du modèle depuis les poids...')
            
            const modelsDir = path.join(process.cwd(), 'ai_models')
            const modelPath = path.join(modelsDir, 'risk-model.json')
            
            // Vérifier si le fichier modèle existe
            if (!fs.existsSync(modelPath)) {
                console.log('Aucun modèle sauvegardé trouvé dans ai_models/')
                return null
            }
            
            // Charger la structure et les poids
            const modelData = JSON.parse(fs.readFileSync(modelPath, 'utf8'))
            console.log(`Chargement modèle sauvé le: ${modelData.savedAt}`)
            
            // Recréer le modèle avec la même architecture
            const model = riskPredictionModel.createModel()
            
            // Restaurer les poids
            const weightTensors = []
            for (const weightData of modelData.weights) {
                const tensor = tf.tensor(weightData.data, weightData.shape)
                weightTensors.push(tensor)
            }
            
            model.setWeights(weightTensors)
            
            // Nettoyer la mémoire
            weightTensors.forEach(w => w.dispose())
            
            console.log('Modèle chargé avec succès depuis ai_models/risk-model.json')
            return model
        } catch (error) {
            console.error('Erreur lors du chargement du modèle:', error.message)
            return null
        }
    },

    //prédiction avec le modele RÉEL
    predict: async (loanFeatures, model = null) => {
        try {
            // Charger le modèle si pas fourni
            if (!model) {
                model = await riskPredictionModel.loadModelFromWeights()
                if (!model) {
                    console.log('Pas de modèle entraîné, utilisation de calcul heuristique')
                    return riskPredictionModel.fallbackPrediction(loanFeatures)
                }
            }

            // Prédiction avec le modèle TensorFlow
            const inputTensor = tf.tensor2d([loanFeatures])
            const prediction = model.predict(inputTensor)
            const score = await prediction.data()
            
            // Nettoyer la mémoire
            inputTensor.dispose()
            prediction.dispose()
            
            const riskScore = score[0] // Valeur entre 0 et 1
            
            let riskLevel = 'Faible'
            if (riskScore > 0.7) riskLevel = 'Élevé'
            else if (riskScore > 0.4) riskLevel = 'Moyen'

            return {
                score: Math.round(riskScore * 10 * 100) / 100,
                riskLevel,
                probability: Math.round(riskScore * 100),
                modelUsed: 'tensorflow-weights'
            }
        } catch (error) {
            console.error("Erreur lors de la prédiction:", error)
            // Fallback en cas d'erreur
            return riskPredictionModel.fallbackPrediction(loanFeatures)
        }
    },

    // Méthode de fallback (calcul heuristique)
    fallbackPrediction: (loanFeatures) => {
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
            probability: Math.round(score * 100),
            modelUsed: 'heuristic'
        }
    }
}

module.exports = riskPredictionModel