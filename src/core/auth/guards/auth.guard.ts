import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { verify } from "jsonwebtoken";
import { environment } from "src/core/enviroment";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const allowAny = this.reflector.get<string[]>(
      "allow-any",
      context.getHandler(),
    );

    const authHeader: string = request.headers["authorization"];
    if (authHeader) {
      try {
        const token = authHeader.split(" ")[1];
        const userObject = verify(token, environment.JWT_SECRET_PASSWORD);
        request.user = userObject;
      } catch {}
    } else if (!allowAny) return false;
    else {
      request.user = null;
    }
    return true;
  }
}
