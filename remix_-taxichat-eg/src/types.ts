export type City = 'Malabo' | 'Bata';

export interface LocationSuggestion {
  name: string;
  description: string;
}

export type ServiceClass = 'compartido' | 'especial' | 'aeropuerto' | 'propuesta';

export type UrgencyLevel = 'normal' | 'intermedio' | 'urgente' | 'muy_urgente';

export type ExperienceLevel = 'novato' | 'ocasional' | 'profesional' | 'experimentado';

export interface DriverProfile {
  name: string;
  lastName: string;
  idNumber: string;
  address: string;
  altPhone: string;
  email: string;
  experience: ExperienceLevel;
  vehicleType: string;
  vehiclePlate: string;
  vehicleColor?: string;
}

export interface ServiceType {
  id: ServiceClass;
  name: string;
  price: number;
  description: string;
  icon: string;
}

export interface TaxiRequest {
  id: string;
  phone: string;
  pickup: string;
  destination: string;
  city: City;
  serviceClass: ServiceClass;
  driverPhone: string;
  timestamp: string;
  estimatedPrice: number;
  passengers: number;
  urgency: UrgencyLevel;
  distanceKm: number;
  durationMin: number;
  vehicleType?: string;
  vehiclePlate?: string;
  driverName?: string;
  driverLastName?: string;
  driverExperience?: string;
  driverAltPhone?: string;
  driverVehicleColor?: string;
  driverAvatar?: string;
  driverAvatarUrl?: string;
  suggestedPrice?: number;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled_by_passenger' | 'cancelled_by_driver';
  paymentStatus?: 'pending' | 'paid';
  acceptedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  rating?: number;
  ratingComment?: string;
}

export interface DriverCommission {
  id: string;
  tripId: string;
  driverName: string;
  driverLastName: string;
  driverPhone: string;
  driverPlate: string;
  pickup: string;
  destination: string;
  tripPrice: number;
  commissionAmount: number;
  createdAt: string;
  status: 'pending' | 'paid';
  paidAt?: string;
  dueDate: string;
  isSuspendedByAdmin?: boolean;
}

export interface RegisteredPassenger {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  city: City;
  registeredAt: string;
  tripsCount: number;
}

export interface RegisteredDriver {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  city: City;
  vehiclePlate: string;
  vehicleType: string;
  registeredAt: string;
  status: 'activo' | 'suspendido';
  verificationStatus?: 'no_submitted' | 'pending' | 'verified' | 'rejected';
  rejectedReason?: string;
  backgroundCheckStatus?: 'pending' | 'passed' | 'failed';
  vehicleInspectionStatus?: 'pending' | 'passed' | 'failed';
  documents?: {
    dip?: { status: 'empty' | 'pending' | 'verified' | 'rejected'; docNumber?: string; expiryDate?: string; url?: string; rejectedReason?: string };
    license?: { status: 'empty' | 'pending' | 'verified' | 'rejected'; docNumber?: string; expiryDate?: string; url?: string; rejectedReason?: string };
    permit?: { status: 'empty' | 'pending' | 'verified' | 'rejected'; docNumber?: string; expiryDate?: string; url?: string; rejectedReason?: string };
  };
}


