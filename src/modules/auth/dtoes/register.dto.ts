import {LoginDto} from "./login.dto";
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";

export class RegisterDto extends LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    fullName: string;
}
