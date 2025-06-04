import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  SwaggerDocs,
  SwaggerParameter,
  SwaggerResponse,
} from 'src/constants/types/swagger/swagger.interface';

export const buildOperationDecorator = (docs: SwaggerDocs) => {
  return ApiOperation({
    summary: docs.summary,
    description: docs.description,
    operationId: docs.operationId,
  });
};

export const buildParameterDecorators = (parameters?: SwaggerParameter[]) => {
  if (!parameters) return [];

  return parameters
    .filter((param) => param.in === 'query')
    .map((param) =>
      ApiQuery({
        name: param.name,
        description: param.description,
        required: param.required,
        type: param.type as string | undefined,
      }),
    );
};

export const buildResponseDecorators = (
  responses: Record<string, SwaggerResponse>,
) => {
  return Object.entries(responses).map(([status, response]) =>
    ApiResponse({
      status: Number(status),
      description: response?.description,
      schema: response?.schema,
    }),
  );
};
