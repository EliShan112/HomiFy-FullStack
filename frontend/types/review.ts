import { User } from "./user";

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author?: User;
};
