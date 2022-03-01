---
title: Ansible-Stack-Rotation
author: Jonathan Ng
tags: [POC]
---

### Stack Rotation Using Ansible

Ansible provides an easily readable way to manage infrastructure, numerous methods for cusomization, and is able to be launched in a wide number of ways. When applied to stack rotation it can provide us with a reusable template which can easily adapted to different projects.

A complete list of Ansible modules can be found [here](https://docs.ansible.com/ansible/2.8/modules/modules_by_category.html)

#### Provisioning a new EC2 instance using Ansible

It is also possible to create a new EC2 instance using the `ec2` task.
```
tasks:
    - name: Provision a set of instances
      ec2:
         key_name: my_key
         group: test
         instance_type: t2.micro
         image: "{{ ami_id }}"
         wait: true
         exact_count: 1
         instance_tags:
            Name: test
      register: ec2
```
See [ansible's provisioning documentation](https://docs.ansible.com/ansible/2.5/scenario_guides/guide_aws.html#provisioning) for more details

This task can be done locally, or on an existing EC2 instance. It is also important to note the setup of AWS credentials for this task. You can directly set the `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY` directly in the `ec2` task, or have these defined as environment variables in the system prior to running the playbook. Another method is to define a set `AWS_PROFILE` in the AWS credentials file and referencing is int he `profile` field. *Note* This will only work if you have the version of boto >= 2.24.0.

[Ansible EC2 intance](https://docs.ansible.com/ansible/latest/collections/amazon/aws/ec2_module.html)

See the [ansible AWS documentation](https://docs.ansible.com/ansible/2.8/modules/list_of_cloud_modules.html#amazon) for other AWS services that can be called through an ansible playbook.

#### Using CodeDeploy and Terraform

This method is used when running an ansible playbook directly on an EC2 instance to set up services directly.

To define customizable parameters to be consumed by the ansible playbook, you can use Terraform's `template_file` to define a `host.yml` file which is then rendered through a Terraform `local_file` For example:

Template hosts.yml file:
``

Terraform code:
```
data "template_file" "inventory" {
  template = "${file("${path.module}/src/templates/hosts.yml")}"

  vars = {
    label  = var.label
    name   = var.name
    region = data.aws_region.current.name
  }
}

resource "local_file" "codedeploy_hosts" {
  content  = data.template_file.inventory.rendered
  filename = "${path.module}/src/ansible/hosts.yml"
}
```

Once the template host file is defined, making is a dependency on the entire playbook `archived_file` will allow you zip up the ansible playbook with the parameters listed in the template host:
```
data "archive_file" "ansible_playbook" {
  type        = "zip"
  depends_on  = ["local_file.codedeploy_hosts"]
  source_dir  = "${path.module}/src/ansible/"
  output_path = "${path.module}/${var.name}_codedeploy.zip"
}
```
The zipped playbook can then be uploaded to an S3 bucket. Additionally, you can create a lambda function to trigger CodeDeploy to execute the playbook once all the resources are created in terraform.

#### Running Ansible Playbook through Packer

If you use Packer to provision AMI images, it is also possible to run an ansible playbook along with your Packer code. This is done by adding the ansible Packer provisioner:

```
"provisioners": [
    {
      "type": "ansible",
      "playbook_file": "./playbook.yml"
    }
  ]
```
