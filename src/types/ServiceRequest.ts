export interface ServiceRequest{
    id: number;
    serviceName: string;
    price: number;
    status: string;
    createdAt: string;
    notes?: string;
    clientName?: string; // Might not have a client attached
    documents?: { id: number; fileName: string }[];
}