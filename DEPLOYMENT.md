# Google Cloud Run Deployment Guide

This guide will help you deploy the Wedding Planner application to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud SDK**: Install the `gcloud` CLI tool

   ```bash
   # macOS
   brew install google-cloud-sdk

   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

## Initial Setup

1. **Authenticate with Google Cloud**:

   ```bash
   gcloud auth login
   ```

2. **Create a new project** (or use an existing one):

   ```bash
   gcloud projects create to-the-altar --name="Wedding Planner"
   gcloud config set project to-the-altar
   ```

3. **Run the setup script**:

   ```bash
   chmod +x scripts/setup-gcp.sh
   ./scripts/setup-gcp.sh
   ```

   This script will enable required APIs and create the Artifact Registry repository.

4. **Set up billing** (required for Cloud Run):
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to Billing and link a payment method

## Deployment Options

### Option 1: Manual Deployment (Quick Start)

Build and deploy in one command:

```bash
# Build and push the image, then deploy
gcloud builds submit --tag us-central1-docker.pkg.dev/to-the-altar/wedding-planner-repo/wedding-planner

# Deploy to Cloud Run
gcloud run deploy wedding-planner \
  --image us-central1-docker.pkg.dev/to-the-altar/wedding-planner-repo/wedding-planner \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 3000
```

### Option 2: Using Cloud Build (Automated)

Deploy using the `cloudbuild.yaml` configuration:

```bash
gcloud builds submit --config cloudbuild.yaml
```

This will:

1. Build the Docker image
2. Push it to Artifact Registry
3. Deploy it to Cloud Run automatically

### Option 3: Local Docker Build (Testing)

Test the Docker image locally before deploying:

```bash
# Build the image
docker build -t wedding-planner .

# Run locally
docker run -p 3000:3000 wedding-planner

# Test at http://localhost:3000
```

## Post-Deployment

After deployment, you'll receive a URL like:

```
https://wedding-planner-xxxxx-uc.a.run.app
```

### Update Environment Variables

If you need to set environment variables:

```bash
gcloud run services update wedding-planner \
  --set-env-vars "NODE_ENV=production,KEY=value" \
  --region us-central1
```

### View Logs

Monitor your application logs:

```bash
gcloud run services logs read wedding-planner --region us-central1
```

### Update Deployment

To update your deployment after making changes:

```bash
# Rebuild and redeploy
gcloud builds submit --tag us-central1-docker.pkg.dev/to-the-altar/wedding-planner-repo/wedding-planner
gcloud run deploy wedding-planner \
  --image us-central1-docker.pkg.dev/to-the-altar/wedding-planner-repo/wedding-planner \
  --region us-central1
```

Or use Cloud Build:

```bash
gcloud builds submit --config cloudbuild.yaml
```

## Custom Domain Setup

1. Go to [Cloud Run Console](https://console.cloud.google.com/run)
2. Select your service
3. Click "Manage Custom Domains"
4. Follow the instructions to map your domain

## Important Notes

### Data Persistence

⚠️ **Current Limitation**: The application uses in-memory storage. Data will be lost when:

- The container restarts
- The service scales to zero
- You deploy a new version

**Recommended Solutions**:

- **Cloud SQL (PostgreSQL)**: For relational data
- **Firestore**: For NoSQL/document data
- **Cloud Storage**: For file uploads

### Cost Considerations

- Cloud Run charges based on:
  - CPU and memory allocation
  - Request count
  - Request duration
- Free tier includes: 2 million requests/month, 360,000 GB-seconds of memory, 180,000 vCPU-seconds
- See [Cloud Run Pricing](https://cloud.google.com/run/pricing) for details

### Scaling

Cloud Run automatically scales based on traffic:

- Scales to zero when no traffic
- Scales up to handle traffic spikes
- Configure min/max instances in the Cloud Console if needed

## Troubleshooting

### Build Fails

- Check that `next.config.ts` has `output: 'standalone'`
- Verify `pnpm-lock.yaml` exists
- Check Docker build logs: `gcloud builds log <BUILD_ID>`

### Deployment Fails

- Ensure APIs are enabled
- Check billing is enabled
- Verify image was pushed successfully

### Application Errors

- Check logs: `gcloud run services logs read wedding-planner --region us-central1`
- Verify environment variables are set correctly
- Test locally with Docker first

## Next Steps

1. Set up a database for persistent storage
2. Configure CI/CD pipeline (GitHub Actions, GitLab CI, etc.)
3. Set up monitoring and alerts
4. Configure custom domain
5. Set up staging environment
