import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from 'src/app/roles/entities/role.entity';
import { Acl } from 'src/app/roles/enums/acl.enum';

export class Roles1701999033731 implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Role);
    try {
      await repository.insert([
        {
          name: 'Admin',
          acl: {
            categories: [Acl.Create, Acl.Read, Acl.Update, Acl.Delete],
            media: [Acl.Create, Acl.Read, Acl.Update, Acl.Delete],
            orders: [Acl.Create, Acl.Read, Acl.Update, Acl.Delete],
            payments: [Acl.Create, Acl.Read, Acl.Update, Acl.Delete],
            products: [Acl.Create, Acl.Read, Acl.Update, Acl.Delete],
            roles: [Acl.Create, Acl.Read, Acl.Update, Acl.Delete],
            users: [Acl.Create, Acl.Read, Acl.Update, Acl.Delete],
          },
        },
        {
          name: 'User',
          acl: {
            categories: [],
            media: [],
            orders: [],
            payments: [],
            products: [],
            roles: [],
            users: [],
          },
        },
      ]);
      console.log('Seed done');
    } catch (error) {
      console.log('Seed failed');
    }
  }
}
