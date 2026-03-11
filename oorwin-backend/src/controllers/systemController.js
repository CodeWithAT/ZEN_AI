"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.onboardEmployee = exports.getEmployees = exports.createClient = exports.getClients = void 0;
const database_1 = __importDefault(require("../config/database"));
const getClients = async (req, res) => {
    try {
        const clients = await database_1.default.client.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: clients });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch clients" });
    }
};
exports.getClients = getClients;
const createClient = async (req, res) => {
    try {
        const { companyName, industry, contactName, contactEmail } = req.body;
        const newClient = await database_1.default.client.create({
            data: {
                companyName,
                industry,
                contactName,
                email: contactEmail
            }
        });
        res.status(201).json({ success: true, data: newClient });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create client: " + error.message });
    }
};
exports.createClient = createClient;
const getEmployees = async (req, res) => {
    try {
        const employees = await database_1.default.employee.findMany({ orderBy: { joinDate: 'desc' } });
        res.json({ success: true, data: employees });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch employees" });
    }
};
exports.getEmployees = getEmployees;
const onboardEmployee = async (req, res) => {
    try {
        const { candidateId, department } = req.body;
        const candidate = await database_1.default.candidate.findUnique({ where: { id: candidateId } });
        if (!candidate)
            return res.status(404).json({ error: "Candidate not found" });
        const existing = await database_1.default.employee.findUnique({ where: { email: candidate.email } });
        if (existing)
            return res.status(400).json({ error: "Employee already exists" });
        const newEmployee = await database_1.default.employee.create({
            data: {
                candidateId: candidate.id,
                name: candidate.name,
                email: candidate.email,
                jobTitle: candidate.currentJobTitle || "New Hire",
                department: department || "General",
                status: "ONBOARDING"
            }
        });
        res.status(201).json({ success: true, data: newEmployee });
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to onboard employee" });
    }
};
exports.onboardEmployee = onboardEmployee;
const deleteClient = async (req, res) => {
    try {
        const id = req.params.id;
        await database_1.default.client.delete({ where: { id } });
        res.json({ success: true, message: "Client deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete client" });
    }
};
exports.deleteClient = deleteClient;
//# sourceMappingURL=systemController.js.map