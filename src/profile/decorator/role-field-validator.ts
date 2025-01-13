import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function RoleFieldValidator(
  role: string,
  validationOptions?: ValidationOptions,
  additionalValidator?: (value: any) => boolean,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'roleFieldValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [role],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          const [requiredRole] = args.constraints;
          const userRole = (args.object as any).role;

          if (userRole === requiredRole) {
            if (additionalValidator) {
              return additionalValidator(value);
            }

            return value != null && value !== '';
          }
          return true;
        },
      },
    });
  };
}
