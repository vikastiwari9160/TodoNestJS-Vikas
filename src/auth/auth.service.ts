import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService, private readonly jwtservice: JwtService) { }

  async register(registerData: RegisterUserDto) {
    const { email } = registerData;
    const user = await this.databaseService.user.findFirst({
      where: {
        email: email
      }
    })
    if (user) {
      throw new BadGatewayException("user already exist!!")
    }
    registerData.password = await bcrypt.hash(registerData.password, 10)
    const res = await this.databaseService.user.create({ data: registerData })
    return res;
  }

  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    const user = await this.databaseService.user.findFirst({
      where: {
        email: email
      }
    })
    if (!user) {
      throw new NotFoundException("No User Exist!");
    }
    const validatePass = await bcrypt.compare(password, user.password);
    if (!validatePass) {
      throw new NotFoundException("Wrong Password!")
    }
    return {
      token: this.jwtservice.sign({ email })
    }
  }
}
