import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Role } from './role.entity';
import Response from '../../commons/response';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getAllRoles() {
    const roles = await this.roleRepository.find({
      where: {
        code: Not('business'),
      },
      relations: { permissions: true },
      order: { id: 'ASC' },
    });

    return Response.get({ items: roles });
  }
}