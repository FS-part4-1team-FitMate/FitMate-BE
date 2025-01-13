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

          console.log(`Validating field: ${propertyName}`);
          console.log(`User role: ${userRole}`);
          console.log(`Field value: ${value}`);

          if (userRole === requiredRole) {
            console.log(`Role is ${requiredRole}, validating ${propertyName} field`);

            if (additionalValidator) {
              return additionalValidator(value);
            }

            return value != null && value !== '';
          }

          console.log(`Role is not ${requiredRole}, skipping validation for ${propertyName}`);
          return true;
        },
      },
    });
  };
}
