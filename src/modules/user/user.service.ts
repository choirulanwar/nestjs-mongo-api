import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, PaginateModel, PaginateResult } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { MongoQueryOptions } from 'src/common/dto/mongo-query-options.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: PaginateModel<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.model.create(createUserDto);

    return user;
  }

  async findAll(
    queryOptions: MongoQueryOptions,
  ): Promise<PaginateResult<User>> {
    const {
      offset = 0,
      limit = 10,
      orderBy = '_id',
      orderType = 'desc',
    } = queryOptions;

    const user = await this.model.paginate(
      {},
      {
        offset,
        limit,
        sort: { [orderBy]: orderType },
        select: '-password',
        populate: queryOptions?.populate,
      },
    );

    return user;
  }

  async findOne(id: string, queryOptions: MongoQueryOptions): Promise<User> {
    const userId = isValidObjectId(id);
    const user = await this.model
      .findOne(
        userId
          ? { _id: id }
          : {
              $or: [
                {
                  username: id,
                },
                { email: id },
              ],
            },
      )
      .select(queryOptions?.fields)
      .select('-password')
      .populate(queryOptions?.populate);

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    queryOptions: MongoQueryOptions,
  ): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new Error('User ID not valid');
    }

    const user = await this.model
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .select(queryOptions?.fields)
      .select('-password')
      .populate(queryOptions?.populate);

    return user;
  }

  async delete(id: string, queryOptions: MongoQueryOptions): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new Error('User ID not valid');
    }

    const user = await this.model
      .findByIdAndDelete(id)
      .select(queryOptions?.fields)
      .select('-password')
      .populate(queryOptions?.populate);

    return user;
  }
}
