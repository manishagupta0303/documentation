# Supported Platforms

Delphix supports Hyperscale Compliance for many data platforms and operating system.

## Supported Masking Engine

- 6.0.12.1

!!! note
    All Masking engines must be of the same versions and must be used only by Hyperscale Compliance for masking. Already existing or running masking/profiling jobs on masking engines would impact Hyperscale Compliance performance and results.

## Supported Browsers (Only API Client)

Hyperscale Compliance API Client is using Swagger UI-3.48.0 that works in the latest versions of Chrome, Safari, Firefox, and Edge. For more information about the supported browser versions, see the **Browser Support** section at [Github](https://github.com/swagger-api/swagger-ui#browser-support).

!!! note
    If you are using Google Chrome, you may encounter the following error code: Chrome NET::ERR_CERT_INVALID.

    To resolve the above error, perform the following steps:

    - Type `https://<orch ip>/static/index.html#/` in the address bar and click **Enter**.
    - Right-click on the page and click **Inspect**.
    - Click the **Console** tab and run the following command: `sendCommand(SecurityInterstitialCommandId.CMD_PROCEED)`.
    - Click on **Authorize** and provide the key. For more information about the key, refer to step 7 in [Generate a New Key](./Hyperscale_Compliance_Installation.md).
