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

export interface CourseType {
  id: number;
  formation_id: number;
  title: string;
  content: string;
  image?: string;
  order: number;
}

export interface FormationType {
  id?: number;
  creator_id?: string;
  categorie: string;
  level: string;
  color: string;
  title: string;
  description: string;
  domainId: number;
  image?: string | Blob | File | Express.Multer.File;
  active: boolean;
  courses?: CourseType[];
  created_at?: Date;
}
