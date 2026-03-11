import { Request, Response } from 'express';
import prisma from '../config/database';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const { companyName, industry, contactName, contactEmail } = req.body;
    
    const newClient = await prisma.client.create({ 
      data: {
        companyName,
        industry,
        contactName,
        email: contactEmail
      }
    });
    res.status(201).json({ success: true, data: newClient });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create client: " + error.message });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({ orderBy: { joinDate: 'desc' } });
    res.json({ success: true, data: employees });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

export const onboardEmployee = async (req: Request, res: Response) => {
  try {
    const { candidateId, department } = req.body;
    
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });

    const existing = await prisma.employee.findUnique({ where: { email: candidate.email } });
    if (existing) return res.status(400).json({ error: "Employee already exists" });

    const newEmployee = await prisma.employee.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to onboard employee" });
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.client.delete({ where: { id } });
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client" });
  }
};