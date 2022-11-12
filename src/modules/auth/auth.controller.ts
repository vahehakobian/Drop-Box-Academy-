import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post} from '@nestjs/common';
import {ApiNoContentResponse, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {AuthService} from './auth.service';
import {LoginPayloadDto} from "../common/modules/auth/login-payload.dto";
import {LoginDto} from "./dtoes/login.dto";
import {RegisterDto} from "./dtoes/register.dto";
import {UserDto} from "../common/modules/user/user.dto";
import {Auth} from "../../decorators/http.decorators";
import {AuthUser} from "../../decorators/auth-user.decorator";
import {UserService} from "../user/user.service";


@Controller('')
@ApiTags('')
export class AuthController {
  constructor(
      public readonly authService: AuthService,
      private readonly userService: UserService,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully login' })
  async login(
      @Body() loginDto: LoginDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully Registered and login' })
  async register(
      @Body() registerDto: RegisterDto,
  ): Promise<LoginPayloadDto> {
    return this.authService.registerAndLogin(registerDto);
  }


  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Get Auth User' })
  @Auth()
  async me(@AuthUser() user: UserDto): Promise<UserDto> {
    return (await this.userService.getEntityById(user.id)).toDto()
  }
}
