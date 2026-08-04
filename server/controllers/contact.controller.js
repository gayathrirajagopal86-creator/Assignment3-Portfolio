import Contact from '../models/contact.model.js'

const create = async (req, res) => {
    try {
        const contact = new Contact(req.body)
        await contact.save()
        res.status(201).json(contact)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const list = async (req, res) => {
    try {
        const contacts = await Contact.find()
        res.json(contacts)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const read = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId)
        if (!contact) return res.status(404).json({ error: 'Contact not found' })
        res.json(contact)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const update = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.contactId,
            req.body,
            { new: true }
        )
        if (!contact) return res.status(404).json({ error: 'Contact not found' })
        res.json(contact)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const remove = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.contactId)
        if (!contact) return res.status(404).json({ error: 'Contact not found' })
        res.json({ message: 'Contact deleted successfully' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const removeAll = async (req, res) => {
    try {
        await Contact.deleteMany()
        res.json({ message: 'All contacts deleted successfully' })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export default { create, list, read, update, remove, removeAll }