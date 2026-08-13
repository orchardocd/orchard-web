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
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.51"
    }
  }
}

provider "hcloud" {}

variable "hostname" {
  description = "Public hostname this server answers on."
  type        = string
  default     = "new.orchardocd.org"
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
    hostname = var.hostname
  })

  labels = {
    app   = "orchard-web"
    stage = "staging"
  }

  lifecycle {
    ignore_changes = [user_data]
  }
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
  value       = "${replace(var.hostname, ".orchardocd.org", "")}  A  ${hcloud_server.web.ipv4_address}"
}

output "ssh" {
  value = "ssh -i infra/deploy_key root@${hcloud_server.web.ipv4_address}"
}
