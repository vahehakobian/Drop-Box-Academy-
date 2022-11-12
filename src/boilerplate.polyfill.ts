import 'source-map-support/register';

import { compact, map } from 'lodash';
import { Brackets, QueryBuilder, SelectQueryBuilder } from 'typeorm';

import { VIRTUAL_COLUMN_KEY } from './decorators/virtual-column.decorator';
import type { AbstractDto } from './modules/common/dtoes/abstract.dto';
import type { AbstractEntity } from './modules/common/entities/abstract.entity';

declare global {
   type Plain<T> = T;

  interface Array<T> {
    toDtos<Entity extends AbstractEntity<Dto>, Dto extends AbstractDto>(
      this: T[],
      options?: any,
    ): Dto[];
  }
}

declare module 'typeorm' {
  interface QueryBuilder<Entity> {
    searchByString(q: string, columnNames: string[]): this;
  }

}

Array.prototype.toDtos = function <
  Entity extends AbstractEntity<Dto>,
  Dto extends AbstractDto,
>(options?: any): Dto[] {
  return compact(map<Entity, Dto>(this, (item) => item.toDto(options)));
};

QueryBuilder.prototype.searchByString = function (q, columnNames) {
  if (!q) {
    return this;
  }

  this.andWhere(
    new Brackets((qb) => {
      for (const item of columnNames) {
        qb.orWhere(`${item} ILIKE :q`);
      }
    }),
  );

  this.setParameter('q', `%${q}%`);

  return this;
};
