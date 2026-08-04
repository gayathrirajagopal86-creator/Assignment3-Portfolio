import Qualification from '../models/qualifications.model.js'

const create = async (req, res) => {
    try {
        const qualification = new Qualification(req.body)
        await qualification.save()
        res.status(201).json(qualification)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const list = async (req, res) => {
    try {
        const qualifications = await Qualification.find()
        res.json(qualifications)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const read = async (req, res) => {
    try {
        const qualification = await Qualification.findById(req.params.qualificationId)
        if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
        res.json(qualification)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const update = async (req, res) => {
    try {
        const qualification = await Qualification.findByIdAndUpdate(
            req.params.qualificationId,
            req.body,
            { new: true }
        )
        if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
        res.json(qualification)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const remove = async (req, res) => {
    try {
        const qualification = await Qualification.findByIdAndDelete(req.params.qualificationId)
        if (!qualification) return res.status(404).json({ error: 'Qualification not found' })
        res.json({ message: 'Qualification deleted successfully' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const removeAll = async (req, res) => {
    try {
        await Qualification.deleteMany()
        res.json({ message: 'All qualifications deleted successfully' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export default { create, list, read, update, remove, removeAll }