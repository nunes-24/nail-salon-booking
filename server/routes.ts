import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertClientSchema, 
  insertServiceCategorySchema, 
  insertServiceSchema, 
  insertAppointmentSchema, 
  insertAvailabilitySchema, 
  insertMessageTemplateSchema 
} from "@shared/schema";
import jwt from 'jsonwebtoken';
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || 'nailartistry-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    
    req.body.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ id: user.id, username: user.username, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });
  
  // Client routes
  app.get('/api/clients', authenticateToken, async (req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching clients' });
    }
  });
  
  app.get('/api/clients/:id', authenticateToken, async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching client' });
    }
  });
  
  app.post('/api/clients', async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      
      const existingClient = await storage.getClientByEmail(validatedData.email);
      if (existingClient) {
        return res.status(409).json({ message: 'Client with this email already exists' });
      }
      
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid client data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating client' });
    }
  });
  
  app.put('/api/clients/:id', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertClientSchema.partial().parse(req.body);
      const updatedClient = await storage.updateClient(parseInt(req.params.id), validatedData);
      
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      res.json(updatedClient);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid client data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating client' });
    }
  });
  
  // Service category routes
  app.get('/api/service-categories', async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service categories' });
    }
  });
  
  app.get('/api/service-categories/:id', async (req, res) => {
    try {
      const category = await storage.getServiceCategory(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: 'Service category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service category' });
    }
  });
  
  app.post('/api/service-categories', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertServiceCategorySchema.parse(req.body);
      const category = await storage.createServiceCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid service category data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating service category' });
    }
  });
  
  app.put('/api/service-categories/:id', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertServiceCategorySchema.partial().parse(req.body);
      const updatedCategory = await storage.updateServiceCategory(parseInt(req.params.id), validatedData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Service category not found' });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid service category data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating service category' });
    }
  });
  
  app.delete('/api/service-categories/:id', authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteServiceCategory(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Service category not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting service category' });
    }
  });
  
  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services' });
    }
  });
  
  app.get('/api/services/category/:categoryId', async (req, res) => {
    try {
      const services = await storage.getServicesByCategory(parseInt(req.params.categoryId));
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services by category' });
    }
  });
  
  app.get('/api/services/:id', async (req, res) => {
    try {
      const service = await storage.getService(parseInt(req.params.id));
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching service' });
    }
  });
  
  app.post('/api/services', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid service data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating service' });
    }
  });
  
  app.put('/api/services/:id', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const updatedService = await storage.updateService(parseInt(req.params.id), validatedData);
      
      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      res.json(updatedService);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid service data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating service' });
    }
  });
  
  app.delete('/api/services/:id', authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteService(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting service' });
    }
  });
  
  // Appointment routes
  app.get('/api/appointments', authenticateToken, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments' });
    }
  });
  
  app.get('/api/appointments/status/:status', authenticateToken, async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByStatus(req.params.status);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments by status' });
    }
  });
  
  app.get('/api/appointments/date/:date', authenticateToken, async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDate(new Date(req.params.date));
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments by date' });
    }
  });
  
  app.get('/api/appointments/:id', authenticateToken, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(parseInt(req.params.id));
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointment' });
    }
  });
  
  app.post('/api/appointments', async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      
      // Check if the client exists, if not, create a new client
      let clientId = validatedData.clientId;
      
      if (req.body.client) {
        const clientData = insertClientSchema.parse(req.body.client);
        const existingClient = await storage.getClientByEmail(clientData.email);
        
        if (existingClient) {
          clientId = existingClient.id;
        } else {
          const newClient = await storage.createClient(clientData);
          clientId = newClient.id;
        }
      }
      
      const appointment = await storage.createAppointment({
        ...validatedData,
        clientId
      });
      
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid appointment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating appointment' });
    }
  });
  
  app.put('/api/appointments/:id', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.partial().extend({
        status: z.enum(['pending', 'confirmed', 'canceled']).optional()
      }).parse(req.body);
      
      const updatedAppointment = await storage.updateAppointment(parseInt(req.params.id), validatedData);
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid appointment data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating appointment' });
    }
  });
  
  app.delete('/api/appointments/:id', authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteAppointment(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting appointment' });
    }
  });
  
  // Availability routes
  app.get('/api/availability', async (req, res) => {
    try {
      const availabilities = await storage.getAvailabilities();
      res.json(availabilities);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching availabilities' });
    }
  });
  
  app.get('/api/availability/:date', async (req, res) => {
    try {
      const availability = await storage.getAvailabilityByDate(new Date(req.params.date));
      if (!availability) {
        return res.json({ isAvailable: true }); // Default to available if no record found
      }
      res.json(availability);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching availability' });
    }
  });
  
  app.post('/api/availability', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertAvailabilitySchema.parse(req.body);
      
      // Check if an availability record already exists for this date
      const existingAvailability = await storage.getAvailabilityByDate(new Date(validatedData.date));
      
      if (existingAvailability) {
        // Update existing availability
        const updatedAvailability = await storage.updateAvailability(
          existingAvailability.id,
          { isAvailable: validatedData.isAvailable }
        );
        return res.json(updatedAvailability);
      }
      
      // Create new availability record
      const availability = await storage.createAvailability(validatedData);
      res.status(201).json(availability);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid availability data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating availability' });
    }
  });
  
  // Message template routes
  app.get('/api/message-templates', authenticateToken, async (req, res) => {
    try {
      const templates = await storage.getMessageTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching message templates' });
    }
  });
  
  app.get('/api/message-templates/:id', authenticateToken, async (req, res) => {
    try {
      const template = await storage.getMessageTemplate(parseInt(req.params.id));
      if (!template) {
        return res.status(404).json({ message: 'Message template not found' });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching message template' });
    }
  });
  
  app.get('/api/message-templates/type/:type', authenticateToken, async (req, res) => {
    try {
      const template = await storage.getMessageTemplateByType(req.params.type);
      if (!template) {
        return res.status(404).json({ message: 'Message template not found' });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching message template' });
    }
  });
  
  app.post('/api/message-templates', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertMessageTemplateSchema.parse(req.body);
      const template = await storage.createMessageTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid message template data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error creating message template' });
    }
  });
  
  app.put('/api/message-templates/:id', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertMessageTemplateSchema.partial().parse(req.body);
      const updatedTemplate = await storage.updateMessageTemplate(parseInt(req.params.id), validatedData);
      
      if (!updatedTemplate) {
        return res.status(404).json({ message: 'Message template not found' });
      }
      
      res.json(updatedTemplate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid message template data', errors: error.errors });
      }
      res.status(500).json({ message: 'Error updating message template' });
    }
  });
  
  // Get service data with category info
  app.get('/api/services-with-categories', async (req, res) => {
    try {
      const services = await storage.getServices();
      const categories = await storage.getServiceCategories();
      
      const servicesWithCategories = services.map(service => {
        const category = categories.find(cat => cat.id === service.categoryId);
        return {
          ...service,
          categoryName: category ? category.name : 'Unknown'
        };
      });
      
      res.json(servicesWithCategories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching services with categories' });
    }
  });
  
  // Get appointments with client and service info
  app.get('/api/appointments-with-details', authenticateToken, async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      const clients = await storage.getClients();
      const services = await storage.getServices();
      
      const appointmentsWithDetails = await Promise.all(appointments.map(async appointment => {
        const client = clients.find(c => c.id === appointment.clientId);
        const service = services.find(s => s.id === appointment.serviceId);
        
        return {
          ...appointment,
          client: client || { name: 'Unknown Client' },
          service: service || { name: 'Unknown Service', price: 0 }
        };
      }));
      
      res.json(appointmentsWithDetails);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments with details' });
    }
  });

  // Create http server
  const httpServer = createServer(app);
  return httpServer;
}
