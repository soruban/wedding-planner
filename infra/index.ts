import * as pulumi from '@pulumi/pulumi';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the root .env.local file
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { createRegistry } from './resources/registry';
import { createDatabase } from './resources/database';
import { createService } from './resources/service';

// 1. Create Artifact Registry
const { repository } = createRegistry();

// 2. Create Database
const { instance, database, user } = createDatabase();

// 3. Create Cloud Run Service (and build image)
const { serviceUrl } = createService({
  imageName: pulumi.interpolate`${repository.location}-docker.pkg.dev/${repository.project}/${repository.repositoryId}/wedding-planner`,
  database: {
    instanceConnectionName: instance.connectionName,
    publicIp: instance.publicIpAddress,
    dbName: database.name,
    dbUser: user.name,
    dbPassword: user.password.apply((p) => p || ''),
  },
});

// Export the URL and Connection Name
export const url = serviceUrl;
export const instanceConnectionName = instance.connectionName;
