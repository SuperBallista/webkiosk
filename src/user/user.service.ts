import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { generateRandomId } from '../utils/random-id.util'; // ID 생성 유틸 가져오기

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOrCreate(email: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      user = this.userRepository.create({
        id: generateRandomId(), // 랜덤 ID 생성
        email,
      });
      await this.userRepository.save(user);
    }

    return user;
  }
}
