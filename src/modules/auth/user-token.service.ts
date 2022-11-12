import {Injectable} from "@nestjs/common";
import {UserTokenRepository} from "./user-token.repository";
import {UserTokenDto} from "../common/modules/auth/user-token.dto";
import {UserTokenFotFoundException} from "./exceptions/user-token-fot-found.exception";
import {UpsertUserTokenDto} from "./dtoes/upsert-user-token.dto";

@Injectable()
export class UserTokenService {
    constructor(private readonly userTokenRepository: UserTokenRepository) {}

    async upsert(upsertUserTokenDto: UpsertUserTokenDto): Promise<UserTokenDto> {
        const entity = (await this.userTokenRepository.findByUserId(upsertUserTokenDto.userId)) || this.userTokenRepository.create(upsertUserTokenDto);

        Object.assign(entity, upsertUserTokenDto);

        return (await this.userTokenRepository.save(entity)).toDto();
    }

    async getById(id: string): Promise<UserTokenDto> {
        const entity = await this.userTokenRepository.findByUserId(id);

        if (!entity) {
            throw new UserTokenFotFoundException();
        }

        return  entity.toDto();
    }

    async delete(id: string): Promise<void> {
        await this.userTokenRepository.delete(id);
    }
}
