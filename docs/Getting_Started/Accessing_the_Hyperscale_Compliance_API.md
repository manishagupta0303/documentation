# Accessing the Hyperscale Compliance API

Open a web browser and type the following in the address bar: `https://<orch ip>/static/index.html#/`.
Replace `orch ip` with the IP address of the Hyperscale Compliance Engine VM.

## Authentication

To authenticate with the Hyperscale Compliance Engine, you must use an API key. It is done by including the key in the HTTP Authorization request header with type apk.

An example cURL command with the API Key looks like the following:

```
curl --header 'Authorization: apk 1.t8YTjLyPiMatdtnhAw9RD0gRVZr2hFsrfikp3YxVl8URdB9zuaVHcMuhXkLd1TLj'
```

As described in the [HTTP Authorization request header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) documentation, following is the typical  syntax for authorization header:

`Authorization: <auth-scheme> <authorisation-parameters>`

For Basic Authentication, You must include following header parameters:
`Authorization: Basic <credentials>`

For Bearer Authentication scheme, you must use the following:
`Authorization: Bearer <JWT Bearer Token>`

## Creating an API Key

An API key is a simple encrypted string that you can use when calling Hyperscale Compliance APIs.

!!! note
    You must use the initial created API key to create a new secure key. It is done by creating a new API Client entity. The "name" attribute must be the desired name to uniquely identify the user of this key. For more information about initial created API key, refer to step 8 under the [Generate a New Key](./Hyperscale_Compliance_Installation.md) section.

Run the following command to create a new API key.

```
curl -X 'POST' \
  'https://<host-name>/v1/management/api-keys' \
  -H 'accept: application/json' \
  -H 'Authorization: apk 1.t8YTjLyPiMatdtnhAw9RD0gRVZr2hFsrfikp3YxVl8URdB9zuaVHcMuhXkLd1TLj' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "<name-of-key>"
}'
```

The above command displays a response message similar to the following:
```
{
  "api_key_id": 2,
  "token": "2.ExZtmf6EN1xvFMsXpXlOyhHVYlTuFzCm2yGhpUOQQ5ID8N8oGz79d4yn8ZsPhF46"
}
```

Since, you have created a new and secure API key, you must delete the old key for security reasons.

Run the following command to delete the old key.
```
curl -X 'DELETE' \
  'https://<host-name>/v1/management/api-keys/1' \
  -H 'accept: */*' \
  -H 'Authorization: apk 2.ExZtmf6EN1xvFMsXpXlOyhHVYlTuFzCm2yGhpUOQQ5ID8N8oGz79d4yn8ZsPhF46'
```

## Using the Newly Generated Key
After you delete the old key, revert the changes performed in step 5 of the [Hyperscale Compliance Installation](./Hyperscale_Compliance_Installation.md) and restart docker-compose.

You must be able to use the new key for authorization as follows:

```
curl --header 'Authorization: apk 2.ExZtmf6EN1xvFMsXpXlOyhHVYlTuFzCm2yGhpUOQQ5ID8N8oGz79d4yn8ZsPhF46'
```
