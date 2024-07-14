import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { jwtAuthGuard } from '../auth/auth.guard';
import { userEmail } from '../common/decorators/user-email.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @ApiBearerAuth()
  @UseGuards(jwtAuthGuard)
  @ApiOperation({ description: 'To add a task!', summary: 'add new task' })
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @userEmail() userEmail: string) {
    return await this.todoService.create(createTodoDto, userEmail);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'To get all tasks!', summary: 'to get all tasks' })
  @Get()
  async findAll(
    @userEmail()
    userEmail: string
  ) {
    return await this.todoService.findAll(userEmail);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'To get a specific task!', summary: 'To get a specific task' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.todoService.findOne(+id);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Update a task!', summary: 'Update a existing task' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todoService.update(+id, updateTodoDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete a specific task!', summary: 'delete a specific task' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.todoService.remove(+id);
  }
}
