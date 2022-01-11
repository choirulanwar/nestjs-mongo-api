import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, PaginateModel, PaginateResult } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { PaginationParams } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: PaginateModel<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.model.create(createUserDto);

    return user;
  }

  async findAll(options: PaginationParams): Promise<PaginateResult<User>> {
    const { offset, limit, orderBy, orderType } = options;

    const user = await this.model.paginate(
      {},
      {
        offset,
        limit,
        sort: { [orderBy]: orderType },
        select: '-password',
      },
    );

    return user;
  }

  async findOne(id: string): Promise<User> {
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
      .select('-password');

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new Error('User ID not valid');
    }

    const user = await this.model
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .select('-password');

    return user;
  }

  async delete(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new Error('User ID not valid');
    }

    const user = await this.model.findByIdAndDelete(id).select('-password');

    return user;
  }
}
