import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { first, has } from 'lodash';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  public async transform(value, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(
          this.handleError(e['response']['message']),
        );
      }
    }
  }

  private handleError(errors) {
    let ers: Object = {};
    errors.map(error => {
      var key: string = first(error.split(' '));
      if (has(ers, key)) {
        ers[key].push(error);
      } else {
        ers[key] = [error];
      }
    });
    return {
      statusCode: 422,
      message: 'Unprocessable Entity',
      errors: ers,
    };

    //return errors.map(error => error.constraints);

    // var ers = [];
    // errors.map(error => {
    //   let messages = Object.values(error.constraints);
    //   if (messages.length > 0) {
    //     ers[error.property] = messages[0];
    //   }
    // });
    // return ers;
  }
}
