# Deployment with Pulumi

We use **Pulumi** to automate the infrastructure provisioning and deployment.

## Prerequisites

1.  **Install Pulumi**:
    ```bash
    brew install pulumi/tap/pulumi
    ```
2.  **Authenticate**:
    ```bash
    pulumi login
    # For local state only: pulumi login --local
    ```
3.  **GCP Authentication**:
    ```bash
    gcloud auth application-default login
    ```

## Configuration

1.  **Navigate to infra directory**:
    ```bash
    cd infra
    ```
2.  **Install dependencies** (if not done):
    ```bash
    npm install
    ```
3.  **Set Database Password**:
    ```bash
    pulumi config set --secret dbPassword <YOUR_SECURE_PASSWORD>
    ```

## Deploying

To view what will be created:

```bash
pulumi preview
```

To create/update the infrastructure:

```bash
pulumi up
```

This command will:

1.  Create the Artifact Registry repository.
2.  Provision the Cloud SQL instance and database.
3.  Build the Docker image and push it to the registry.
4.  Deploy the Cloud Run service connected to the database.

## Outputs

After deployment, Pulumi will output the service URL and other details:

```bash
Outputs:
  url: "https://wedding-planner-..."
```

## Database Migrations

After the database is created, you need to run migrations. connect via Proxy:

```bash
# 1. Start Proxy
./cloud-sql-proxy <CONNECTION_NAME>

# 2. Run Migration
DATABASE_URL="postgresql://wedding_user:<PASSWORD>@localhost:5432/wedding_planner" npx prisma migrate deploy
```

## Useful Commands

- `pulumi destroy`: Tear down all resources (be careful!).
- `pulumi stack output`: View stack outputs.
