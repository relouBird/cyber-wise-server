// Types
export interface DomainType {
  id?: number;
  name: string;
  categorie: string;
  description: string;
  icon: string;
  color: string;
  is_native: boolean;
}

export interface Course {
  id: number;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface FormationType {
  id?: number;
  creator_id?: string;
  categorie: string;
  color: string;
  title: string;
  description: string;
  domainId: number;
  image?: string | Blob | File;
  active: boolean;
  courses?: Course[];
  created_at?: Date;
}
