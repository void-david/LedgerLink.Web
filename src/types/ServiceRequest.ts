export interface ServiceRequest{
    id: number;
    serviceName: string;
    price: number;
    status: string;
    createdAt: string;
    clientName?: string; // Might not have a client attached
}