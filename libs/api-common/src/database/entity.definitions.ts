export interface Identifiable {
  id: string;
}

export interface IdentifiableDate {
  date: string;
}

export interface UserTracked {
  createdBy: string | null;
  updatedBy: string | null;
}

export interface TimeTracked {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleted {
  deletedAt: Date | null;
}
