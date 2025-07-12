export interface SubCoursesInterface {
  id?: number;
  course_id: number;
  sib: number;
  title: string;
  content: string;
  image?: string;
  order: number;
  status: "pending" | "completed";
}
