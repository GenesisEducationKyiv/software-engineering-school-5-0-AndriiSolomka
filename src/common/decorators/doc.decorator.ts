import { applyDecorators } from '@nestjs/common';
import { SwaggerDocs } from 'src/constants/types/swagger/swagger.interface';
import {
  buildOperationDecorator,
  buildParameterDecorators,
  buildResponseDecorators,
} from 'src/utils/swagger/swagger';

export function ApiDocs(docs: SwaggerDocs) {
  return applyDecorators(
    buildOperationDecorator(docs),
    ...buildParameterDecorators(docs.parameters),
    ...buildResponseDecorators(docs.responses),
  );
}
