@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refreshToken']; // 쿠키에서 리프레시 토큰 가져오기

    if (!refreshToken) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'default-secret',
      });
      request.user = decoded;
      return true;
    } catch (err) {
      return false;
    }
  }
}
