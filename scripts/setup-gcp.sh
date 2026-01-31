#!/bin/bash

# Setup script for Wedding Planner GCP project

# Exit on error
set -e

echo "Starting GCP Setup for Wedding Planner..."

# check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Set project ID
PROJECT_ID="to-the-altar"
echo "Setting project to $PROJECT_ID..."
gcloud config set project "$PROJECT_ID"

echo "Current Project ID: $PROJECT_ID"

echo "Enabling required APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    containerregistry.googleapis.com

echo "Creating Artifact Registry repository..."
# Check if repo exists first to avoid error
if gcloud artifacts repositories describe wedding-planner-repo --location=us-central1 --project="$PROJECT_ID" &>/dev/null; then
    echo "Repository 'wedding-planner-repo' already exists."
else
    gcloud artifacts repositories create wedding-planner-repo \
        --repository-format=docker \
        --location=us-central1 \
        --description="Docker repository for Wedding Planner" \
        --project="$PROJECT_ID"
    echo "Repository created successfully."
fi

echo "Setup complete!"
echo "Project ID: $PROJECT_ID"
echo "Repository: us-central1-docker.pkg.dev/$PROJECT_ID/wedding-planner-repo"
