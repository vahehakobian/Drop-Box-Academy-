import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1666546232923 implements MigrationInterface {
    name = 'createTables1666546232923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "full_name" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "path" character varying NOT NULL, "share_link" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a7435dbb7583938d5e7d137604" ON "files" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."users_tokens_type_enum" AS ENUM('VERIFY_ACCOUNT', 'FORGOT_PASSWORD', 'AUTH', 'REFRESH')`);
        await queryRunner.query(`CREATE TABLE "users_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, "token" character varying NOT NULL, "type" "public"."users_tokens_type_enum" NOT NULL, CONSTRAINT "UQ_16796eb52a059007e7e4f5fa72e" UNIQUE ("token"), CONSTRAINT "UQ_c7178ae495d0ae58b04304a54c2" UNIQUE ("user_id", "type"), CONSTRAINT "PK_9f236389174a6ccbd746f53dca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16796eb52a059007e7e4f5fa72" ON "users_tokens" ("token") `);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_a7435dbb7583938d5e7d1376041" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_a7435dbb7583938d5e7d1376041"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16796eb52a059007e7e4f5fa72"`);
        await queryRunner.query(`DROP TABLE "users_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."users_tokens_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a7435dbb7583938d5e7d137604"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
