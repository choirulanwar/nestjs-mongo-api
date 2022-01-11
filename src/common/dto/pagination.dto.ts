import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

enum ORDER_TYPE {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  orderBy?: string = '_id';

  @IsOptional()
  @IsEnum(ORDER_TYPE)
  @IsString()
  orderType?: string = 'desc';

  @IsOptional()
  @IsString()
  filter?: string;
}
