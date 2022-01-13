import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema, UserDocument } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Query } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          schema.pre<UserDocument>('save', async function (next) {
            if (this?.password) {
              const salt = await bcrypt.genSalt(6);
              this.password = await bcrypt.hash(this.password, salt);
            }

            return next();
          });

          schema.pre<Query<User, UserDocument>>(
            'findByIdAndUpdate',
            async function (next) {
              const _update = <UserDocument>this.getUpdate();

              if (_update?.password) {
                const salt = await bcrypt.genSalt(6);
                const password = await bcrypt.hash(_update.password, salt);

                _update.password = password;
              }

              return next();
            },
          );

          schema.methods.comparePassword = function (
            submittedPassword: string,
          ) {
            return bcrypt.compare(submittedPassword, this.password);
          };

          return schema;
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
