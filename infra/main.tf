terraform {
  required_version = ">= 1.10"

  backend "s3" {
    bucket       = "orchard-web-tofu-state-600786191241"
    key          = "orchard-web/staging.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.51"
    }
  }
}

provider "hcloud" {}

provider "aws" {
  region = var.aws_region
}

variable "server_type" {
  description = "Hetzner server type."
  type        = string
  default     = "cx23"
}

variable "location" {
  description = "Hetzner location. Falkenstein keeps the data in the EEA."
  type        = string
  default     = "fsn1"
}

variable "ssh_allowlist" {
  description = "CIDRs allowed to reach SSH. Empty means anywhere."
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}

variable "aws_region" {
  description = "Region holding the state bucket and the deploy secrets."
  type        = string
  default     = "us-east-1"
}

variable "state_bucket" {
  description = "Bucket holding the OpenTofu state. Backends cannot read variables, so this repeats the backend block."
  type        = string
  default     = "orchard-web-tofu-state-600786191241"
}

variable "github_repositories" {
  description = "Repository forms GitHub may name in the subject claim. It issues the plain form and the immutable form carrying the owner and repository ids, so both identify this one repository."
  type        = list(string)
  default = [
    "orchardocd/orchard-web",
    "orchardocd@304538876/orchard-web@1331285588",
  ]
}

variable "github_deploy_ref" {
  description = "The only ref allowed to assume the deploy role."
  type        = string
  default     = "refs/heads/main"
}

locals {
  caddyfile = file("${path.module}/Caddyfile")

  # The Caddyfile opens with the site address, which is the hostname the server
  # answers on. Reading it back keeps the two in step.
  hostname = trimspace(split("{", local.caddyfile)[0])
}

resource "hcloud_ssh_key" "deploy" {
  name       = "orchard-web-deploy"
  public_key = file("${path.module}/deploy_key.pub")
}

resource "hcloud_firewall" "web" {
  name = "orchard-web"

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "22"
    source_ips = var.ssh_allowlist
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  rule {
    direction  = "in"
    protocol   = "icmp"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

resource "hcloud_server" "web" {
  name         = "orchard-web"
  server_type  = var.server_type
  location     = var.location
  image        = "ubuntu-24.04"
  ssh_keys     = [hcloud_ssh_key.deploy.id]
  firewall_ids = [hcloud_firewall.web.id]
  backups      = true

  user_data = templatefile("${path.module}/cloud-init.yaml", {
    caddyfile = indent(6, chomp(local.caddyfile))
  })

  labels = {
    app   = "orchard-web"
    stage = "staging"
  }

  lifecycle {
    ignore_changes = [user_data]
  }
}

data "aws_caller_identity" "current" {}

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "ci_trust" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [for repository in var.github_repositories : "repo:${repository}:ref:${var.github_deploy_ref}"]
    }
  }
}

data "aws_iam_policy_document" "ci" {
  statement {
    actions   = ["s3:ListBucket"]
    resources = ["arn:aws:s3:::${var.state_bucket}"]
  }

  statement {
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["arn:aws:s3:::${var.state_bucket}/orchard-web/*"]
  }

  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = ["arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:prod/orchard-web/*"]
  }
}

resource "aws_iam_role" "ci" {
  name               = "orchard-web-ci"
  description        = "Assumed by GitHub Actions to read the state and deploy."
  assume_role_policy = data.aws_iam_policy_document.ci_trust.json
}

resource "aws_iam_role_policy" "ci" {
  name   = "deploy"
  role   = aws_iam_role.ci.id
  policy = data.aws_iam_policy_document.ci.json
}

output "ci_role_arn" {
  description = "Set this as the AWS_ROLE_ARN repository variable in GitHub."
  value       = aws_iam_role.ci.arn
}

output "ipv4" {
  description = "Point the DNS A record at this."
  value       = hcloud_server.web.ipv4_address
}

output "ipv6" {
  value = hcloud_server.web.ipv6_address
}

output "dns_record" {
  description = "The record to add in the FastComet cPanel zone editor."
  value       = "${replace(local.hostname, ".orchardocd.org", "")}  A  ${hcloud_server.web.ipv4_address}"
}

output "ssh" {
  value = "ssh -i infra/deploy_key root@${hcloud_server.web.ipv4_address}"
}
