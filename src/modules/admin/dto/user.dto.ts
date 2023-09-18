import { IsNumber } from "class-validator";
import { FilterQuery } from "mongoose";
import { User, UserDocumnet } from "src/core/entities/user.entity";

type UserSortKey = {
  [key in keyof UserDocumnet]: 1 | -1;
};

export class Filter {
  @IsNumber()
  take: number;
  @IsNumber()
  skip: number;
  sort?: UserSortKey;
  find?: FilterQuery<User>;
}

export class AdminGetUsersDto extends Filter {}
