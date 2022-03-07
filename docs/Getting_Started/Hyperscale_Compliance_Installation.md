# Installation

This section describes the steps you must perform to install the Hyperscale Compliance Engine.

## Hyperscale Compliance Installation

### Pre-requisites

Ensure that you meet the following requirements before you install the Hyperscale Compliance Engine.

* Download the Hyperscale tar file (`delphix-hyperscale-masking-2.0.0.0.tar.gz`) from [download.delphix.com](https://download.delphix.com/).
* You must create a user that has permissions to install Docker and Docker compose.
* Install Docker on VM.  Minimum supported docker version is 20.10.7.
* Install Docker compose on VM. Minimum supported docker-compose version is 1.29.2.
* Check if docker and docker-compose are installed by running following command:

    * `docker-compose -v`

         The above command displays an output similar to the following:

         `docker-compose version 1.29.2, build 5becea4c`

    * `docker -v`

         The above command displays an output similar to the following:

         `Docker version 20.10.8, build 3967b7d`

### Procedure

Perform the following procedure to install the Hyperscale Compliance Engine.

1. Unpack the Hyperscale tar file.

    `tar -xzf delphix-hyperscale-masking-2.0.0.0.tar.gz`

2. Load the extracted tars into Docker.

    ```
    docker load --input app.tar
    docker load --input proxy.tar
    ```

3. Create a mount on the Hyperscale Compliance Engine VM.
    1. The shared path on the mount server must have 777 permission recursively.
    2. Create a directory inside the local path (for example, `<user.home>/hyperscale`) on the Hyperscale Compliance Engine VM. This path is the same local path that is configured in the docker-compose.yaml file in step 4.
    3. Create a sub-directory (for example, `<user.home>/hyperscale/mount-dir`) within the directory created in the above step and mount the NFS shared storage here. This NFS shared storage is a ‘Staging Area’ for the Hyperscale Compliance and can be mounted in two ways as described in the [NFS server Installation](./NFS_Server_Installation.md).

        !!! note
            The directory created in step 3c (mount-dir) will be provided as the mount name in the Mount Filesystem API.

4. Configure the Hyperscale Compliance Engine container volume binding. Edit the docker-compose.yaml file from tar. In the Hyperscale Service Volumes     section, add the Hyperscale Compliance Engine VM path (from 3(b), `<user.home>/hyperscale`) to the Hyperscale Compliance Engine container path(/etc/hyperscale) volume binding.

5. Configure the Hyperscale Compliance Engine container to create a new API key.

    !!! note
        This is a one-time key generation process. After you generate another key using this key, then you must revert these changes and restart docker-compose. Edit `docker-compose.yaml` file from tar. In the **Hyperscale Service Environment** section, set `API_KEY_CREATE` to string "true".

    !!! info
        You must uncomment the `API_KEY_CREATE=true` line.

    A sample output of docker-compose.yaml file looks like the following:

    ```
    networks:
      hyperscale-net: {}
    services:
      hyperscale:
        image: delphix-hyperscale-masking-app:2.0.0.0
        init: true
        networks:
          hyperscale-net: null
        restart: unless-stopped
        volumes:
          - hyperscale-data:/data:rw
          - /home/delphix/mount-files:/etc/hyperscale
        environment:
          - API_KEY_CREATE=true
      proxy:
        depends_on:
          hyperscale:
            condition: service_started
        image: delphix-hyperscale-masking-proxy:2.0.0.0
        init: true
        networks:
          hyperscale-net: null
        ports:
          - published: 443
            target: 443
        restart: unless-stopped
    version: '3.7'
    volumes:
      hyperscale-data: {}
    ```

6. (OPTIONAL) To modify the default Hyperscale configuration properties for the application, see [Configuration Settings](../Configuration_Settings/Configuration_Settings.md).
7. Run the application from the same location where you extracted the docker-compose.yaml file.

    `docker-compose up -d`

    * Run the following command to check if the application is running. The output of this command should show two containers up and running.

        `docker-compose ps`

    * Run the following command to access application logs.

        `docker logs -f  <app_container_name>`

        !!! note
            App container name can be accessed by output of the command `docker-compose ps` i.e. the name of the container running from docker image `delphix-hyperscale-masking-app`.

    * Run the following command to stop the application (if required).

        `sudo docker-compose down`

8. Generate a new key using the key generated in step 5. Run the following command to open the application logs.

	 `Docker logs -f delphix-hyperscale-1`

    The above command displays an output similar to the following:

    ```
    20-12-2021 10:51:57.974 [main] INFO  o.a.c.c.C.[Tomcat].[localhost].[/].log - Initializing Spring embedded WebApplicationContext
    20-12-2021 10:51:57.974 [main] INFO  o.s.b.w.s.c.ServletWebServerApplicationContext.prepareWebApplicationContext - Root WebApplicationContext: initialization completed in 3089 ms
    NEWLY GENERATED API KEY: 1.t8YTjLyPiMatdtnhAw9RD0gRVZr2hFsrfikp3YxVl8URdB9zuaVHcMuhXkLd1TLj
    ```

    The above logs output shows an API key has been created. You can use this key to authenticate with the Hyperscale Compliance Engine. For more ifnormation, see the **Authentication** section under [Accessing the Hyperscale Compliance API](./Accessing_the_Hyperscale_Compliance_API.md).

## Masking Engine Installation

Delphix Masking Engine is a multi-user, browser-based web application that provides complete, secure, and scalable software for your sensitive data discovery, masking, and tokenization needs while meeting enterprise-class infrastructure requirements.
For information about installing the masking engine, see [Masking Engine Installation](https://maskingdocs.delphix.com/Getting_Started/Installation/First_Time_Setup/) documentation.
