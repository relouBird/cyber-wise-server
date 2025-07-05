export interface ActivityType {
  id?: number;
  org_id: string;
  activity_id: string;
  type: string;
  title: string;
  message: string;
  active: boolean;
  created_at?: string;
}
