import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  serviceCategories, type ServiceCategory, type InsertServiceCategory,
  services, type Service, type InsertService,
  appointments, type Appointment, type InsertAppointment,
  availability, type Availability, type InsertAvailability,
  messageTemplates, type MessageTemplate, type InsertMessageTemplate 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Service category operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  updateServiceCategory(id: number, category: Partial<InsertServiceCategory>): Promise<ServiceCategory | undefined>;
  deleteServiceCategory(id: number): Promise<boolean>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getServicesByCategory(categoryId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Appointment operations
  getAppointments(): Promise<Appointment[]>;
  getAppointmentsByStatus(status: string): Promise<Appointment[]>;
  getAppointmentsByDate(date: Date): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment & { status: string }>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;
  
  // Availability operations
  getAvailabilities(): Promise<Availability[]>;
  getAvailability(id: number): Promise<Availability | undefined>;
  getAvailabilityByDate(date: Date): Promise<Availability | undefined>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, availability: Partial<InsertAvailability>): Promise<Availability | undefined>;
  deleteAvailability(id: number): Promise<boolean>;
  
  // Message template operations
  getMessageTemplates(): Promise<MessageTemplate[]>;
  getMessageTemplate(id: number): Promise<MessageTemplate | undefined>;
  getMessageTemplateByType(type: string): Promise<MessageTemplate | undefined>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: number, template: Partial<InsertMessageTemplate>): Promise<MessageTemplate | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private serviceCategories: Map<number, ServiceCategory>;
  private services: Map<number, Service>;
  private appointments: Map<number, Appointment>;
  private availabilities: Map<number, Availability>;
  private messageTemplates: Map<number, MessageTemplate>;
  
  private userId: number;
  private clientId: number;
  private serviceCategoryId: number;
  private serviceId: number;
  private appointmentId: number;
  private availabilityId: number;
  private messageTemplateId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.serviceCategories = new Map();
    this.services = new Map();
    this.appointments = new Map();
    this.availabilities = new Map();
    this.messageTemplates = new Map();
    
    this.userId = 1;
    this.clientId = 1;
    this.serviceCategoryId = 1;
    this.serviceId = 1;
    this.appointmentId = 1;
    this.availabilityId = 1;
    this.messageTemplateId = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      isAdmin: true,
    });
    
    // Initialize with default service categories
    this.initializeDefaultData();
  }
  
  private initializeDefaultData() {
    // Default service categories
    const manicureCategory = this.createServiceCategory({
      name: "Manicure",
      image: "https://images.unsplash.com/photo-1604902396830-aca29e19b067",
    });
    
    const pedicureCategory = this.createServiceCategory({
      name: "Pedicure",
      image: "https://images.unsplash.com/photo-1621605817954-50e01ba60195",
    });
    
    // Default services for Manicure
    this.createService({
      categoryId: manicureCategory.id,
      name: "Gel Simples",
      price: 25,
      duration: 45,
      image: "https://images.unsplash.com/photo-1610992003053-45eb2cde1ca6",
    });
    
    this.createService({
      categoryId: manicureCategory.id,
      name: "Nail Art",
      price: 35,
      duration: 60,
      image: "https://images.unsplash.com/photo-1631730442003-50af2b9aee97",
    });
    
    // Default services for Pedicure
    this.createService({
      categoryId: pedicureCategory.id,
      name: "Pedicure Básica",
      price: 30,
      duration: 50,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53",
    });
    
    // Default message templates
    this.createMessageTemplate({
      type: "confirmation",
      subject: "Confirmação de Agendamento",
      body: "Olá {client_name}, seu agendamento foi confirmado para {appointment_date} às {appointment_time}. Serviço: {service_name}. Obrigado!",
    });
    
    this.createMessageTemplate({
      type: "cancellation",
      subject: "Cancelamento de Agendamento",
      body: "Olá {client_name}, seu agendamento para {appointment_date} às {appointment_time} foi cancelado. Caso queira reagendar, entre em contato conosco.",
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Client operations
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (client) => client.email === email,
    );
  }
  
  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientId++;
    const client: Client = { 
      ...insertClient, 
      id, 
      lastVisit: null,
      totalSpent: 0
    };
    this.clients.set(id, client);
    return client;
  }
  
  async updateClient(id: number, clientUpdate: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient = { ...client, ...clientUpdate };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  // Service category operations
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }
  
  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }
  
  async createServiceCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.serviceCategoryId++;
    const category: ServiceCategory = { ...insertCategory, id };
    this.serviceCategories.set(id, category);
    return category;
  }
  
  async updateServiceCategory(id: number, categoryUpdate: Partial<InsertServiceCategory>): Promise<ServiceCategory | undefined> {
    const category = this.serviceCategories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryUpdate };
    this.serviceCategories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteServiceCategory(id: number): Promise<boolean> {
    return this.serviceCategories.delete(id);
  }
  
  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.categoryId === categoryId,
    );
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async createService(insertService: InsertService): Promise<Service> {
    const id = this.serviceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }
  
  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...serviceUpdate };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Appointment operations
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }
  
  async getAppointmentsByStatus(status: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.status === status,
    );
  }
  
  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.appointments.values()).filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === targetDate.getTime();
    });
  }
  
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentId++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      status: "pending" 
    };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async updateAppointment(id: number, appointmentUpdate: Partial<InsertAppointment & { status: string }>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...appointmentUpdate };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }
  
  // Availability operations
  async getAvailabilities(): Promise<Availability[]> {
    return Array.from(this.availabilities.values());
  }
  
  async getAvailability(id: number): Promise<Availability | undefined> {
    return this.availabilities.get(id);
  }
  
  async getAvailabilityByDate(date: Date): Promise<Availability | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.availabilities.values()).find((availability) => {
      const availabilityDate = new Date(availability.date);
      availabilityDate.setHours(0, 0, 0, 0);
      return availabilityDate.getTime() === targetDate.getTime();
    });
  }
  
  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const id = this.availabilityId++;
    const availability: Availability = { ...insertAvailability, id };
    this.availabilities.set(id, availability);
    return availability;
  }
  
  async updateAvailability(id: number, availabilityUpdate: Partial<InsertAvailability>): Promise<Availability | undefined> {
    const availability = this.availabilities.get(id);
    if (!availability) return undefined;
    
    const updatedAvailability = { ...availability, ...availabilityUpdate };
    this.availabilities.set(id, updatedAvailability);
    return updatedAvailability;
  }
  
  async deleteAvailability(id: number): Promise<boolean> {
    return this.availabilities.delete(id);
  }
  
  // Message template operations
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return Array.from(this.messageTemplates.values());
  }
  
  async getMessageTemplate(id: number): Promise<MessageTemplate | undefined> {
    return this.messageTemplates.get(id);
  }
  
  async getMessageTemplateByType(type: string): Promise<MessageTemplate | undefined> {
    return Array.from(this.messageTemplates.values()).find(
      (template) => template.type === type,
    );
  }
  
  async createMessageTemplate(insertTemplate: InsertMessageTemplate): Promise<MessageTemplate> {
    const id = this.messageTemplateId++;
    const template: MessageTemplate = { ...insertTemplate, id };
    this.messageTemplates.set(id, template);
    return template;
  }
  
  async updateMessageTemplate(id: number, templateUpdate: Partial<InsertMessageTemplate>): Promise<MessageTemplate | undefined> {
    const template = this.messageTemplates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...templateUpdate };
    this.messageTemplates.set(id, updatedTemplate);
    return updatedTemplate;
  }
}

export const storage = new MemStorage();
