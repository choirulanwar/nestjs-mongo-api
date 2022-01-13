import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';
import { MongoQueryOptions } from 'src/common/dto/mongo-query-options.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      } else {
        throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    queryOptions: MongoQueryOptions,
  ): Promise<PaginateResult<User>> {
    try {
      return await this.userService.findAll(queryOptions);
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true }))
    queryOptions: MongoQueryOptions,
  ): Promise<User> {
    try {
      const user = await this.userService.findOne(id, queryOptions);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Query(new ValidationPipe({ transform: true }))
    queryOptions: MongoQueryOptions,
  ): Promise<User> {
    try {
      const user = await this.userService.update(
        id,
        updateUserDto,
        queryOptions,
      );

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Query(new ValidationPipe({ transform: true }))
    queryOptions: MongoQueryOptions,
  ): Promise<User> {
    try {
      const user = await this.userService.delete(id, queryOptions);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
