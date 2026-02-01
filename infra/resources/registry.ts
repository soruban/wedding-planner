import * as gcp from '@pulumi/gcp';

export const createRegistry = () => {
  const repository = new gcp.artifactregistry.Repository('wedding-planner-repo', {
    repositoryId: 'wedding-planner-repo',
    format: 'DOCKER',
    location: 'us-central1',
    description: 'Docker repository for Wedding Planner',
  });

  return { repository };
};
