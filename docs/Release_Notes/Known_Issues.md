# Known Issues

This section describes known issues fixed in Hyperscale Compliance.

## Release 2.0.0
The following is a list of the known issues in the Hyperscale Compliance version 2.0.0.

| Key | Summary | Workaround |
| --- | --- | --- |
| HM-294 | Updated file format is not POST'ed on the Masking Engine if file format name is same | <ul><li>After modifying the file format content, rename the file name of the file format.</li><li> Delete the existing uploaded file format from the attached Masking Engines before executing the Hyperscale job with an updated file format.</li></ul> |
| HM-291 | Hyperscale job execution with intelligent load balancer configured is stuck in a loop if job's max memory is more than totalAllocatedMemoryForJobs | None |
| HM-216 | POST/PUT /data-sets accepts duplicate values as source_files path in Single File Info Object | None |
| HM-177 | Able to POST /hyperscale-masking/jobs with min job memory > max job memory | None |
