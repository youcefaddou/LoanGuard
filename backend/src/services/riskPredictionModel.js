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
            const model = this.createModel()
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
            const modelPath = "file://./models/risk_model"
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
                model = await this.loadModel()
                if (!model) {
                    throw new Error('Aucun modèle chargé')
                }
            }
            const inputTensor = tf.tensor2d([loanFeatures])
            const prediction = model.predict(inputTensor)
            const riskScore = await prediction.data()

            inputTensor.dispose()
            prediction.dispose()

            const score = riskScore[0]
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
