# Network Requirements

This section describes the network requirements for Hyperscale Compliance. Ensure that you meet all the network requirements before you install the Hyperscale Compliance Engine.

The following are the inbound/outbound rules for the Hyperscale Compliance Engine:

| Type (Inbound/Outbound) | Port | Reason |
| --- | --- | --- |
| Inbound and Outbound | 80 | HTTP connections to/from the Hyperscale Compliance Engine to/from the Masking Engines part of the Masking Engine Cluster and to access the Hyperscale Compliance API. |
| Inbound and Outbound | 443 | HTTPs connections to/from the Hyperscale Compliance Engine to/from the Masking Engines part of the Masking Engine Cluster and to access the Hyperscale Compliance API. |
| Outbound | 53 | Connections to local DNS servers.|
| Inbound | 22 | SSH connections to the Hyperscale Compliance Engine host. |

## Hyperscale Compliance Engine Host Requirement on Linux

| Type | Host Requirement | Explanation |
| --- | --- | --- |
| User | A user (hyperscale_os) with the following permissions are required:<ul><li>Should have permissions to install docker and docker-compose.</li><li>Should be part of the 'docker' OS group or must have the permission to run `docker` and `docker-compose` commands.</li><li>Permission to run mount, unmount, mkdir, rmdir, and ping as a super-user with NOPASSWD.</li></ul> | This will be a primary user responsible to install and operate the Hyperscale Compliance. |
| Installation Directory | There must be a directory on the Hyperscale Compliance Engine host where the Hyperscale Compliance can be installed. | This is a directory where the Hyperscale Compliance tar archive file will be placed and extracted. The extracted artifacts will include docker images(tar archive files) and a configuration file(docker-compose.yaml) that will be used to install the Hyperscale Compliance. |
| Log File Directory | An optional directory to place log files. | This directory (can be configured via docker-compose.yaml configuration file) will host the  runtime/log files of the Hyperscale Compliance Engine. |
| NFS Client Services | NFS client services must be enabled on the host. | NFS client service is required to be able to mount an NFS shared storage from where the Hyperscale Compliance Engine will be able to read the source files and write the target files. For more information, see [NFS Server Installation](./NFS_Server_Installation.md). |
| Network Connectivity | The Hyperscale Compliance Engine must be able to communicate with each node of the Masking Engine Cluster on port 443 or 80 (not recommended).<br/> A user can initiate the following tests from the orch_host_checker.sh script to check:<ul><li>OS and Host permissions/access</li><li>Network Port Checks</li></ul> | The orch_os user must have sufficient permissions to execute basic connectivity commands on the OS (ping, ip address, traceroute, etc.). |
| Hardware Requirements | Minimum:<br/>8 vCPU, 8 GB of memory, 100GB data disk. <br/><br/>Recommended:<br/>16 vCPU, 32GB of memory, 500GB data disk. | OS disk space: 50 GB |
