import { Injectable } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UtilsProvider} from '../../providers/utils.provider';
import {ApiConfigService} from '../../shared/services/api-config.service';
import {UserEntity} from '../user/user.entity';
import {UserService} from '../user/user.service';
import {TokenTypeEnum} from '../../constants/token-type.enum';
import {TokenPayloadDto} from "../common/modules/auth/token-payload.dto";
import {IGenerateJWTOptions} from "../common/interfaces/IGenerateJWTOptions";
import {UserTokenService} from "./user-token.service";
import { RegisterDto } from './dtoes/register.dto';
import { LoginPayloadDto } from 'modules/common/modules/auth/login-payload.dto';
import { UserUnauthenticatedException } from './exceptions/user-unauthenticated.exception';
import { LoginDto } from './dtoes/login.dto';

@Injectable()
export class AuthService {
  constructor(
      public readonly jwtService: JwtService,
      public readonly configService: ApiConfigService,
      public readonly userService: UserService,
      private readonly userTokenService: UserTokenService
  ) {}

  async generateToken(options: IGenerateJWTOptions): Promise<TokenPayloadDto> {
    return options.expiresIn ? {
      expiresIn: options.expiresIn,
      token: await this.jwtService.signAsync(options.payload, {expiresIn: options.expiresIn}),
    } : {
      expiresIn: options.expiresIn,
      token: await this.jwtService.signAsync(options.payload),
    };
  }

  async validateUser(loginDto: LoginDto): Promise<UserEntity> {
    const userEntity = await this.userService.getEntityByEmail(loginDto.email);
    const isPasswordValid = await UtilsProvider.validateHash(
        loginDto.password,
        userEntity.password,
    );

    if (!isPasswordValid) {
      const description = 'password is an invalid'
      throw new UserUnauthenticatedException(description);
    }

    return userEntity;
  }

  async login(userInfo: LoginDto | UserEntity): Promise<LoginPayloadDto> {
    let userEntity: UserEntity;
    if(userInfo instanceof UserEntity) {
      userEntity = userInfo;
    } else {
      userEntity = await this.validateUser(userInfo);
    }

    const token = await this.generateToken({payload: {id: userEntity.id, type: TokenTypeEnum.AUTH}, expiresIn: this.configService.authConfig.jwtExpirationTime});
    const user = userEntity.toDto();
    return { user, token };
  }

  async registerAndLogin(registerDto: RegisterDto): Promise<LoginPayloadDto> {
    const userEntity = await this.userService.create({ ...registerDto })
    .catch((err) => {
      throw new UserUnauthenticatedException(err);
    });
    return this.login(userEntity);
  }

 }
