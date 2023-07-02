import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { UserEntity } from "src/entities/user.entity";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return data
      ? (req.user?.[data] as keyof UserEntity | undefined)
      : (req.user as UserEntity);
  },
);

export const AllowAny = () => SetMetadata("allow-any", true);
