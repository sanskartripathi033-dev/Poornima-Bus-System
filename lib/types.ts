// TypeScript interfaces for PU-BusLink

export type UserRole = 'student' | 'admin';

export interface PUUser {
  uid: string;
  name: string;
  studentId: string;
  email: string;
  routeId: string;
  role: UserRole;
  createdAt: Date;
}

export interface BusStop {
  id: string;
  name: string;
  time: string; // e.g. "08:15 AM"
  lat: number;
  lng: number;
  order: number;
}

export interface BusRoute {
  id: string;
  name: string;
  busNumber: string;
  stops: BusStop[];
  active: boolean;
  departureTime: string;
  returnTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bus {
  id: string;
  routeId: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  lat: number;
  lng: number;
  lastUpdated: Date;
  isActive: boolean;
  speed?: number; // km/h
}

export interface BusAlert {
  id: string;
  message: string;
  type: 'delay' | 'cancelled' | 'info' | 'emergency';
  busId?: string;
  routeId?: string;
  busNumber?: string;
  routeName?: string;
  createdAt: Date;
  active: boolean;
}

export interface AuthError {
  code: string;
  message: string;
}
