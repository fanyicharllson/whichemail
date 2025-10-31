 interface Service {
    id: string;
    serviceName: string;
    email: string;
    categoryId: string;
    notes?: string;
    website?: string;
    hasPassword: boolean;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
}