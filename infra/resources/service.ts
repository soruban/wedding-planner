import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';
import * as pulumi from '@pulumi/pulumi';

interface ServiceProps {
  imageName: pulumi.Input<string>;
  database: {
    instanceConnectionName: pulumi.Input<string>;
    publicIp: pulumi.Input<string>;
    dbName: pulumi.Input<string>;
    dbUser: pulumi.Input<string>;
    dbPassword: pulumi.Input<string>;
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

  // Create Secrets for Clerk
  const clerkPubKeySecret = new gcp.secretmanager.Secret('clerk-publishable-key', {
    secretId: 'clerk-publishable-key',
    replication: { auto: {} },
  });
  new gcp.secretmanager.SecretVersion('clerk-publishable-key-v1', {
    secret: clerkPubKeySecret.id,
    secretData: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'dummy_key_replace_me',
  });

  const clerkSecretKeySecret = new gcp.secretmanager.Secret('clerk-secret-key', {
    secretId: 'clerk-secret-key',
    replication: { auto: {} },
  });
  new gcp.secretmanager.SecretVersion('clerk-secret-key-v1', {
    secret: clerkSecretKeySecret.id,
    secretData: process.env.CLERK_SECRET_KEY || 'dummy_key_replace_me',
  });

  // Create Cloud Run Service
  const service = new gcp.cloudrunv2.Service(
    'wedding-planner',
    {
      location,
      template: {
        containers: [
          {
            image: pulumi.interpolate`${props.imageName}:latest`, // Force use of 'latest' tag
            envs: [
              {
                name: 'DATABASE_URL',
                // ... (start of envs content matches existing)
                value: pulumi.interpolate`postgresql://${props.database.dbUser}:${props.database.dbPassword}@localhost/${props.database.dbName}?host=/cloudsql/${props.database.instanceConnectionName}`,
              },
              {
                name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
                valueSource: {
                  secretKeyRef: {
                    secret: clerkPubKeySecret.secretId,
                    version: 'latest',
                  },
                },
              },
              {
                name: 'CLERK_SECRET_KEY',
                valueSource: {
                  secretKeyRef: {
                    secret: clerkSecretKeySecret.secretId,
                    version: 'latest',
                  },
                },
              },
              {
                name: 'DEPLOY_TIMESTAMP',
                value: new Date().toISOString(),
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
    },
    { dependsOn: [image] },
  );

  // Make service public
  new gcp.cloudrunv2.ServiceIamMember('public-access', {
    project: service.project,
    location: service.location,
    name: service.name,
    role: 'roles/run.invoker',
    member: 'allUsers',
  });

  // Grant access to secrets for the Cloud Run service account
  // Note: Cloud Run uses the default compute service account by default
  const project = gcp.organizations.getProject({});
  const defaultServiceAccount = project.then(
    (p) => `${p.number}-compute@developer.gserviceaccount.com`,
  );

  new gcp.secretmanager.SecretIamMember('clerk-pub-key-access', {
    secretId: clerkPubKeySecret.id,
    role: 'roles/secretmanager.secretAccessor',
    member: pulumi.interpolate`serviceAccount:${defaultServiceAccount}`,
  });

  new gcp.secretmanager.SecretIamMember('clerk-secret-key-access', {
    secretId: clerkSecretKeySecret.id,
    role: 'roles/secretmanager.secretAccessor',
    member: pulumi.interpolate`serviceAccount:${defaultServiceAccount}`,
  });

  return { serviceUrl: service.uri };
};
