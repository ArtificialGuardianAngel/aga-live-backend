import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdminService } from "src/admin/admin.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly adminService: AdminService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const allowAny = this.reflector.get<string[]>(
      "allow-any",
      context.getHandler(),
    );

    const authCookie: string = request.cookies["pwd"];
    if (authCookie) {
      return this.adminService.compareHashes(authCookie);
    } else if (!allowAny) return false;
    else {
      request.user = null;
    }
    return true;
  }
}
