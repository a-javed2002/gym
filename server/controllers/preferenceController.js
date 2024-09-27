import Preference from '../models/Preference.js';

// Create a new preference
export const createPreference = async (req, res) => {
    try {
        const preference = new Preference(req.body);
        await preference.save();
        res.status(201).send(preference);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all preference
export const getAllProgressLog = async (req, res) => {
    try {
        const preference = await Preference.find();
        res.send(preference);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a preference by ID
export const getPreference = async (req, res) => {
    try {
        const preference = await Preference.findById(req.params.id);
        if (!preference) {
            return res.status(404).send();
        }
        res.send(preference);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a preference by ID
export const updatePreference = async (req, res) => {
    try {
        const preference = await Preference.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!preference) {
            return res.status(404).send();
        }
        res.send(preference);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a preference by ID
export const deletePreference = async (req, res) => {
    try {
        const preference = await Preference.findByIdAndDelete(req.params.id);
        if (!preference) {
            return res.status(404).send();
        }
        res.send(preference);
    } catch (error) {
        res.status(500).send(error);
    }
};
