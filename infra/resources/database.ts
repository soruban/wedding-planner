import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

export const createDatabase = () => {
  const config = new pulumi.Config();
  const dbPassword = config.requireSecret('dbPassword');

  // Create Cloud SQL Instance
  const instance = new gcp.sql.DatabaseInstance('wedding-planner-db', {
    databaseVersion: 'POSTGRES_15',
    settings: {
      tier: 'db-f1-micro', // Cheapest tier for dev
      ipConfiguration: {
        ipv4Enabled: true, // For easier external access during dev, restrict in prod
      },
    },
    deletionProtection: false, // Be careful with this in production!
  });

  // Create Database
  const database = new gcp.sql.Database('wedding_planner', {
    instance: instance.name,
    name: 'wedding_planner',
  });

  // Create User
  const user = new gcp.sql.User('postgres-user', {
    instance: instance.name,
    name: 'wedding_user',
    password: dbPassword,
  });

  return { instance, database, user };
};
