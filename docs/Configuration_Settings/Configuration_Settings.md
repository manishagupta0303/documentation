# Configuration Settings

The following table lists the Hyperscale Compliance properties with their default values.

| Group | Property name | Type | Description | Default value |
| --- | ---| --- | --- | --- |
| **Hyperscale** | engines.certificate.path| String | Path of masking engine certificates | /etc/config/cert |
| | root.config.path | String | Root path which Hyperscale will be looking into for source files | /etc/hyperscale |
| | masking.file.formats | String | Path where Hyperscale will store masking file format files | /masking-file-formats |
| | splitted.files.dir | String | Path where Hyperscale will store splitted source files ] | /splitted-files |
| | target.dir | String | Path where Hyperscale will store masked files | /tgt|
| | staging.dir | String | Path where Hyperscale will store masked files for splitted source files (this is relevant only if file merging of masked files is set to true) | /stg|
| | remove.splitted.masked.files | Boolean | Flag to indicate retaining or removing staging splitted masked files | true |
| | monitor.initial.delay | Integer | Masking job monitor delay in seconds | 1 |
| | monitor.poll.duration | Integer | Masking job monitoring duration in seconds| 10 |
| | scheduler.poll.duration| Integer | Job scheduler poll duration in seconds| 60 |
| | intelligent.loadbalance.enabled | Boolean | Enable Intelligent load balancing/Round robin load balancing approach. By default, Intelligent load balancing is enabled| true|
| | job.monitor.pool.corePoolSize| Integer | Defines number of thread pools created for Masking Job Monitor service | 5 |
| | job.monitor.pool.maxPoolSize| Integer | Defines number of threads created in a pool for Masking Job Monitor service | 20 |
| | job.monitor.pool.keepAliveSeconds| Integer | Defines keep alive time in second for threads of Masking Job Monitor | 300|
| | job.monitor.pool.queueCapacity | Integer | Defines maximum queue capacity of the pool | 50 |
| | job.monitor.pool.threadPrefix| String | Thread name prefix for Masking Job Monitor threads| JobMonitorTaskExecutor |
| **Spring Framework** | logging.level.root| String | Root Log level | WARN|
| | logging.level.com.delphix.hyperscale | String | Custom log level for a package or class | INFO |
| | logging.file.name | String | Log file name/path| /opt/delphix/logs/hyperscale.log |
| | logging.pattern.file | String | Format of log entries | `%d{dd-MM-yyyy HH:mm:ss.SSS} \[%thread\] %-5level %logger{36}.%M - %msg%n` |
| | logging.pattern.rolling-file-name| String | Archive log file name/path | /opt/delphix/logs/archived/hyperscale-%d{yyyy-MM-dd}.%i.log |
| | logging.file.max-size | String | Maximum individual log file size before it will be archived (format 5MB, 100MB) | 5MB |
| | logging.file.max-history| integer | History in days (i.e. keep 15 days' worth of history capped at 5GB total size) | 15 |
| | logging.file.total-size-cap | String | Max total size that the archive folder can hold. | 5GB|

## How to Change the Hyperscale Properties

You can set the above Hyperscale properties as environment variables in a Hyperscale Application Container using the ‘environment’ key inside the compose file i.e. docker-compose.yaml. You can locate the `docker-compose.yaml` file in the directory where the `delphix-hyperscale-masking-dev.tar.gz` is extracted.

!!! note
    You must start or restart the container after overriding these properties in the `docker-compose.yaml` file.

The below file describes the content of the `docker-compose.yaml` file after updating the Hyperscale properties.

```
networks:
  hyperscale-net: {}
services:
  hyperscale:
    environment:
      - API_KEY_CREATE=true
      - ENGINES_CERTIFICATE_PATH=/etc/config/cert
      - ROOT_CONFIG_PATH=/etc/hyperscale
      - MASKING_FILE_FORMATS=/masking-file-formats
      - SPLITTED_FILES_DIR=/splitted-files
      - TARGET_DIR=/tgt
      - STAGING_DIR=/stg
      - REMOVE_SPLITTED_MASKED_FILES=true
      - MONITOR_INITIAL_DELAY=1
      - MONITOR_POLL_DURATION=10
      - SCHEDULER_POLL_DURATION=60
      - INTELLIGENT_LOADBALANCE_ENABLED=false
    image: delphix-hyperscale-masking-app:1
    init: true
    networks:
      hyperscale-net: null
    restart: unless-stopped
    volumes:
      - hyperscale-data:/data:rw
      - /home/delphix/hyperscale_logs:/opt/delphix/logs:rw
      - /mnt/provision:/etc/hyperscale:rw
  proxy:
    depends_on:
      hyperscale:
        condition: service_started
    image: delphix-hyperscale-masking-proxy:1
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
