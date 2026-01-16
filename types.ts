
export enum UserRole {
  ADMIN = 'Administrador',
  SINDICO = 'Síndico',
  OPERACIONAL = 'Operacional'
}

export enum Urgency {
  BAIXA = 'Baixa',
  MEDIA = 'Média',
  ALTA = 'Alta'
}

export enum MaintenanceStatus {
  ABERTO = 'Aberto',
  EM_ANDAMENTO = 'Em Andamento',
  CONCLUIDO = 'Concluído'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  condoIds?: string[]; // Admin has access to all if empty or special flag
}

export interface QRCodeArea {
  id: string;
  condoId: string;
  areaName: string;
  lastCleaned?: string;
  cleaningFrequency?: string;
}

export interface CleaningLog {
  id: string;
  condoId: string;
  areaId: string;
  areaName: string;
  timestamp: string;
  userId: string;
  userName: string;
  observation: string;
  photo?: string;
}
