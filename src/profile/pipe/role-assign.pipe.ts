import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { AlsStore } from '#common/als/store-validator.js';

@Injectable()
export class RoleAssignPipe implements PipeTransform {
  constructor(private readonly alsStore: AlsStore) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const { userRole } = await this.alsStore.getStore();
    value.role = userRole;
    console.log(`찍어보아요 ${value.role}`);

    return value;
  }
}
