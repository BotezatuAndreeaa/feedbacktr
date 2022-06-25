const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const cors = require('cors')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'proiect.db'
})

sequelize.authenticate()
    .then(() => { console.warn('Conexiune resusita!') })
    .catch((error) => {
        console.warn(error)
    })

const Utilizator = sequelize.define('utilizator', {

    numeUtilizator:
    {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('numeUtilizator', value.toLowerCase())
        }
    },
    parola:
    {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('parola', value.toLowerCase())
        }
    },
    email:
    {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('email', value.toLowerCase())
        }
    }
})

const Feedback = sequelize.define('feedback', {

    plecare:
    {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('plecare', value.toLowerCase())
        }
    },

    sosire:
    {
        type: Sequelize.STRING,
        allowNull: false,
        set(value) {
            this.setDataValue('sosire', value.toLowerCase())
        }
    },

    tipTransport:
    {
        type: Sequelize.STRING,
        allowNull: false
    },

    oraPlecare:
    {
        type: Sequelize.STRING,
        allowNull: false
    },

    durata:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    gradAglomerare:
    {
        type: Sequelize.STRING,
        allowNull: false
    },

    detalii:
    {
        type: Sequelize.TEXT,
    },

    gradSatisfactie:
    {
        type: Sequelize.INTEGER,
        allowNull: false
    }

})

Utilizator.hasMany(Feedback)

const app = express()
app.use(cors())
app.use(bodyParser.json())


app.get('/sync', async (req, res) =>{
    try{
        await sequelize.sync({ force: true })
        res.status(201).json({message: 'Tabelele au fost create!'})
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server!'})
    }
})


app.get('/utilizatori', async (req, res) => {
    try {
        const utilizatori = await Utilizator.findAll( )
        res.status(200).json(utilizatori)
    } catch (error) {
        console.warn(error)
    }
})
app.post('/utilizatori', async (req, res) => {
    try {
        await Utilizator.create(req.body)
        res.status(201).json({message: 'Utilizatorul a fost creat!'})
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})

//
app.get('/utilizatori/:utilizatorId', async (req, res) => {
    try {
        const utilizator = await Utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            res.status(201).json(utilizator)
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})
app.put('/utilizatori/:utilizatorId', async (req, res) => {
    try {
        const Utilizator = await utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            await utilizator.update(req.body, { fields: ['plecare', 'sosire', 'firstName'] })
            res.status(202).json({ message: 'Acceptat' })
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})
app.delete('/utilizatori/:utilizatorId', async (req, res) => {
    try {
        const utilizator = await Utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            await utilizator.destroy()
            res.status(202).json({ message: 'Acceptat' })
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})


app.get('/feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll()
        res.status(200).json(feedbacks)
    } catch (error) {
        console.warn(error)
    }
})
app.post('/feedbacks', async (req, res) => {
    try {
        await Feedback.create(req.body)
        res.status(201).json({message: 'Feedback creat!'})
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})

//
app.get('/feedbacks/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id)
        if(feedback){
            res.status(201).json(feedback)
        }else{
            res.status(404).json({message: 'Feedbackul  nu a fost gasit!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})
app.put('/feedbacks/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id)
        if(feedback){
            await feedback.update(req.body, { fields: ['plecare', 'sosire', 'tipTransport', 'oraPlecare', 'durata', 'gradAglomerare', 'detalii', 'gradSatisfactie'] })
            res.status(202).json({ message: 'Acceptat' })
        }else{
            res.status(404).json({message: 'Feedbackul  nu a fost gasit!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})
app.delete('/feedbacks/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByPk(req.params.id)
        if(feedback){
            await feedback.destroy()
            res.status(202).json({ message: 'Acceptat' })
        }else{
            res.status(404).json({message: 'Feedbackul  nu a fost gasit!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})


app.get('/utilizatori/:utilizatorId/feedbacks', async (req, res) => {
    try {
        const utilizator = await Utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            const feedbacks = await utilizator.getFeedbacks()
            res.status(200).json(feedbacks)
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})

app.post('/utilizatori/:utilizatorId/feedbacks', async (req, res) => {
    try {
        const utilizator = await Utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            const feedback = req.body
            feedback.utilizatorId = utilizator.id
            await Feedback.create(feedback)
            res.status(201).json({ message: 'Feedback-ul utilizatorului a fost actualizat!' })
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})

app.get('/utilizatori/:utilizatorId/feedbacks/:id', async (req, res) => {
    try {
        const utilizator = await Utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            const feedbacks = await utilizator.getFeedbacks( { where: { id: req.params.id} } )
            const feedback = feedbacks.shift()
            if (feedback){
                res.status(200).json(feedback)
            } else{
                res.status(404).json({message: 'Feedbackul  nu a fost gasit!'})
            }
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})

app.post('/utilizatori/:utilizatorId/feedbacks/:id', async (req, res) => {
    try {
        const utilizator = await utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            const feedbacks = await Utilizator.getFeedbacks( { where: { id: req.params.id} } )
            const feedback = feedbacks.shift()
            if (feedback){
                await feedback.update(req.body)
                res.status(202).json({message: 'Utilizatorul a fost actualizat!'})
            } else{
                res.status(404).json({message: 'Feedbackul  nu a fost gasit!'})
            }
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})

app.delete('/utilizatori/:utilizatorId/feedbacks/:id', async (req, res) => {
    try {
        const utilizator = await Utilizator.findByPk(req.params.utilizatorId)
        if(utilizator){
            const feedbacks = await utilizator.getFeedbacks( { where: { id: req.params.id} } )
            const feedback = feedbacks.shift()
            if (feedback){
                await feedback.destroy()
                res.status(202).json({message: 'Utilizatorul a fost sters!'})
            } else{
                res.status(404).json({message: 'Feedbackul  nu a fost gasit!'})
            }
        }else{
            res.status(404).json({message: 'Utilizatorul nu exista!'})
        }
    } catch (error) {
        console.warn(error)
        res.status(500).json({ message: 'Eroare server'})
    }
})

app.listen(8080)

sequelize.sync()
    .then(() => console.log('Creat cu succes!'))
    .catch((error) => console.log(error))