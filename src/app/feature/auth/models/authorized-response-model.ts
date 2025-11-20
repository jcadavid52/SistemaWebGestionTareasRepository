import { UserModel } from "./user-model";

export interface AuthorizedResponseModel{
accessToken:string;
refreshToken:string;
user:UserModel;
}