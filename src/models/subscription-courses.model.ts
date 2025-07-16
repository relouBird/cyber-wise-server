import { Fetch } from "../database/fetch";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { Delete } from "../database/delete";
import { Storage } from "../database/storage";
import { DatabaseUser } from "../database/user";
import { CourseType } from "../types/training.type";
import { ErrorHandler } from "../types/database.type";
import { SubCoursesInterface } from "../types/sub-courses.type";

export class SubscriptionCoursesClass {
  protected name: string = "courses-subscription";
  protected fetch: Fetch;
  protected createClass: Create;
  protected updateClass: Update;
  protected deleteClass: Delete;
  protected storage: Storage;
  protected databaseUser: DatabaseUser;

  constructor() {
    this.fetch = new Fetch(this.name);
    this.updateClass = new Update(this.name);
    this.createClass = new Create(this.name);
    this.deleteClass = new Delete(this.name);
    this.storage = new Storage(this.name);
    this.databaseUser = new DatabaseUser("users");
  }

  async getAll(
    errorHandler?: ErrorHandler
  ): Promise<SubCoursesInterface[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAll((error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as SubCoursesInterface[];

    if (!isError) {
      return data;
    }

    return null;
  }

  async getAllBySubTraining(
    id: string | number,
    errorHandler?: ErrorHandler
  ): Promise<SubCoursesInterface[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAllByParameter(
      "sib",
      id as string,
      (error) => {
        errorHandler && errorHandler(error);
        isError = true;
      }
    )) as SubCoursesInterface[];

    if (!isError) {
      return data;
    }

    return null;
  }

  async createSubForCourses(
    id: number,
    courseList: CourseType[],
    errorHandler?: ErrorHandler
  ) {
    const tabData: SubCoursesInterface[] = [];

    for (let i = 0; i < courseList.length; i++) {
      let valueIndexed = courseList[i];
      tabData.push({
        course_id: valueIndexed.id,
        sib: id,
        title: valueIndexed.title,
        content: valueIndexed.content,
        image: valueIndexed.image,
        order: valueIndexed.order,
        status: "pending",
      });
    }

    const data = (await this.createClass.insertMany(tabData, (error) => {
      console.log("erreur-courses =>", error?.message);
      errorHandler && errorHandler(error);
    })) as SubCoursesInterface[];
    return data;
  }

  async update(
    id: string,
    payload: SubCoursesInterface,
    errorHandler?: ErrorHandler
  ) {
    const data = (await this.updateClass.UpdateById(id, payload, (error) => {
      errorHandler && errorHandler(error);
    })) as SubCoursesInterface;

    return data;
  }
}
