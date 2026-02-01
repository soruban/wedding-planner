import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';
import * as pulumi from '@pulumi/pulumi';

interface ServiceProps {
  imageName: string;
  database: {
    instanceConnectionName: pulumi.Output<string>;
    publicIp: pulumi.Output<string>;
    dbName: pulumi.Output<string>;
    dbUser: pulumi.Output<string>;
    dbPassword: pulumi.Output<string>;
  };
}

export const createService = (props: ServiceProps) => {
  const config = new pulumi.Config();
  const location = gcp.config.region || 'us-central1';

  // Build and Push Image
  const image = new docker.Image('wedding-planner-image', {
    imageName: pulumi.interpolate`${props.imageName}:latest`,
    build: {
      context: '../', // Build context is the root of the repo
      platform: 'linux/amd64', // Cloud Run requires amd64
      args: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '', // Build arg
      },
    },
  });

  // Create Cloud Run Service
  const service = new gcp.run.v2.Service('wedding-planner', {
    location,
    template: {
      containers: [
        {
          image: image.imageName,
          envs: [
            {
              name: 'DATABASE_URL',
              // Connection string for Cloud Run (using Cloud SQL connector)
              value: pulumi.interpolate`postgresql://${props.database.dbUser}:${props.database.dbPassword}@localhost/${props.database.dbName}?host=/cloudsql/${props.database.instanceConnectionName}`,
            },
            {
              name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
              value: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
            },
            {
              name: 'CLERK_SECRET_KEY',
              value: process.env.CLERK_SECRET_KEY,
            },
          ],
          volumeMounts: [
            {
              name: 'cloudsql',
              mountPath: '/cloudsql',
            },
          ],
        },
      ],
      volumes: [
        {
          name: 'cloudsql',
          cloudSqlInstance: {
            instances: [props.database.instanceConnectionName],
          },
        },
      ],
      scaling: {
        maxInstanceCount: 1, // Keep costs low for now
      },
    },
    traffics: [
      {
        type: 'TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST',
        percent: 100,
      },
    ],
  });

  // Make service public
  new gcp.run.v2.ServiceIamMember('public-access', {
    project: service.project,
    location: service.location,
    name: service.name,
    role: 'roles/run.invoker',
    member: 'allUsers',
  });

  return { serviceUrl: service.uri };
};
