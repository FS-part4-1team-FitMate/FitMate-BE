// import { Injectable, ExecutionContext } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class NaverAuthGuard extends AuthGuard('naver') {
//   constructor() {
//     super();
//   }

//   getAuthenticateOptions(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const role = request.query.role;
//     const state = role;
//     console.log('Authorize State:', state);
//     return { state };
//   }
// }
