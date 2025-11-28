#!/bin/bash
# Small helper script to create ECR repo, ECS cluster and (optional) IAM roles. Run locally with AWS CLI configured.

set -euo pipefail

AWS_REGION=${1:-us-east-1}
ECR_REPO=${2:-brewluxe}
CLUSTER_NAME=${3:-brewluxe-cluster}
SERVICE_NAME=${4:-brewluxe-service}

echo "Region: $AWS_REGION"
echo "ECR repo: $ECR_REPO"
echo "ECS cluster: $CLUSTER_NAME"
echo "ECS service: $SERVICE_NAME"

# Create ECR repo if it doesn't exist
if ! aws ecr describe-repositories --repository-names "$ECR_REPO" --region "$AWS_REGION" >/dev/null 2>&1; then
  aws ecr create-repository --repository-name "$ECR_REPO" --region "$AWS_REGION"
  echo "Created ECR repo: $ECR_REPO"
else
  echo "ECR repo $ECR_REPO already exists"
fi

# Create ECS cluster
if ! aws ecs describe-clusters --clusters "$CLUSTER_NAME" --region "$AWS_REGION" | grep "$CLUSTER_NAME" >/dev/null; then
  aws ecs create-cluster --cluster-name "$CLUSTER_NAME" --region "$AWS_REGION"
  echo "Created ECS cluster: $CLUSTER_NAME"
else
  echo "ECS cluster $CLUSTER_NAME already exists"
fi

# Note: you still need an IAM role for task execution: ecsTaskExecutionRole. Follow AWS docs if missing.

echo "Next steps:
- Create or confirm IAM roles: ecsTaskExecutionRole and ecsTaskRole with proper policies.
- Update server/ecs-task-def.template.json executionRoleArn and taskRoleArn with your account-specific ARNs.
- Create an ECS service (Fargate) tied to the cluster and a load balancer if you want public access.
"