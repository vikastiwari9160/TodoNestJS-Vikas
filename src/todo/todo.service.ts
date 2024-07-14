import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(createTodoDto: CreateTodoDto, userEmail: string) {
    try {
      const user = await this.databaseService.user.findFirst({
        where: {
          email: userEmail
        }
      })
      let data: Prisma.TodoCreateInput = {
        task: createTodoDto.task,
        description: createTodoDto.description,
        status: 'ACTIVE',
        user: {
          connect: {
            email: user.email
          }
        },
      }
      return await this.databaseService.todo.create({ data });
    } catch (err) {
      return err
    }
  }

  async findAll(userEmail: string) {
    return await this.databaseService.todo.findMany({
      where: {
        userEmail: userEmail
      }
    });
  }

  async findOne(id: number) {
    return await this.databaseService.todo.findFirst({
      where: {
        id: id
      }
    });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.databaseService.todo.update({
      where: {
        id: id
      },
      data: updateTodoDto
    });
  }

  async remove(id: number) {
    return await this.databaseService.todo.delete({
      where: {
        id: id
      }
    });
  }
}
