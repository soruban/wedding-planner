import * as gcp from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';

export const createDatabase = () => {
  // CONFIGURATION: Generate a secure random password automatically
  const dbPassword = new random.RandomPassword('db-password', {
    length: 24,
    special: true,
    overrideSpecial: '!#$%&*()-_=+[]{}<>:?', // Avoid problematic chars for URLs
  }).result;

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

  // Store Password in Secret Manager
  const secret = new gcp.secretmanager.Secret('wedding-planner-db-password', {
    replication: {
      auto: {},
    },
    secretId: 'wedding-planner-db-password',
  });

  new gcp.secretmanager.SecretVersion('wedding-planner-db-password-v1', {
    secret: secret.id,
    secretData: dbPassword,
  });

  return { instance, database, user, secret };
};
