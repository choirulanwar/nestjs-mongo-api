import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { ORDER_TYPE } from 'src/common/dto/enum.dto';

export class MongoQueryOptions {
  @IsOptional()
  @IsString()
  filter?: string;

  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(',').join(' '))
  fields?: string;

  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => value.split(',').join(' '))
  populate?: string;

  /* Pagination part  */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  limit?: number;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(ORDER_TYPE)
  @IsString()
  orderType?: string;

  @IsOptional()
  @IsString()
  startCursor?: string;

  @IsOptional()
  @IsString()
  endCursor?: string;
  /* Pagination part end */
}
