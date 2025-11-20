import { TaskModel } from "./task-model";

export interface TasksResponseModel {
    tasks: TaskModel[];
    pageSize: number;
    totalCount: number;
}