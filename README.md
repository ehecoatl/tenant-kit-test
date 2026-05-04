# Ehecoatl Tenant Kit Test

Official test tenant kit for Ehecoatl main runtime functionality.

This repository is a full tenant kit used to validate the current tenant/app shape, shared middleware behavior, app scanning, path-based routing, static assets, templates, HTTP actions, WebSocket routes, sessions, auth, CSRF, CORS, and isolated app runtime behavior.

Unlike the Empty Tenant Kit, this kit intentionally includes multiple app roots and demo routes. It is meant for smoke testing and runtime validation, not as the smallest production starter.

## What This Kit Provides

This tenant kit demonstrates:

- tenant-level `config.json`
- tenant-local `.ehecoatl/` system files
- tenant-owned nginx template
- shared tenant middleware folders
- multiple app roots inside the same tenant
- default app routing through `defaultAppName`
- path-based app routing through `appRoutingMode`
- static HTML asset serving
- `.e.htm` template rendering
- route-level `i18n`
- Markdown rendering inside templates
- HTTP action execution
- action-driven template rendering
- cache-backed session behavior
- auth and auth-scope middleware examples
- CSRF middleware examples
- route-driven CORS examples
- WebSocket route definitions
- WebSocket broadcast demo from app `boot()`

## Tenant Config

The tenant config lives at:

```text
config.json
```

Current shape:

```json
{
  "alias": [],
  "certbotEmail": null,
  "appRoutingMode": "path",
  "defaultAppName": "www",
  "ehecoatlVersion": "0.1.0-beta",
  "tenantId": "7vhdq1j8gk4d",
  "tenantDomain": "test1.ehecoatl.com.br",
  "source": {}
}
```

Main fields:

- `alias`: optional alternate domain identities
- `certbotEmail`: optional email used for certificate automation
- `appRoutingMode`: tenant app routing mode, such as `path`
- `defaultAppName`: default app fallback for the tenant domain
- `ehecoatlVersion`: expected Ehecoatl runtime version
- `tenantId`: opaque tenant identifier
- `tenantDomain`: human-readable domain identity used for routing
- `source`: optional source metadata used by deployment/update tooling

When this kit is installed into a real tenant root, runtime-specific values such as `tenantId` and `tenantDomain` may be patched or managed by Ehecoatl tooling.

## Repository Structure

```text
.
├── .ehecoatl/
│   └── lib/
│       └── nginx.e.conf
│
├── app_app1/
├── app_app2/
├── app_app3/
├── app_www/
│
├── shared/
│   └── app/
│
├── config.json
├── LICENSE
└── README.md
```

## App Roots

This tenant kit uses multiple app roots:

```text
app_www/
app_app1/
app_app2/
app_app3/
```

The `app_www` app is the default app for the tenant because `config.json` declares:

```json
{
  "defaultAppName": "www"
}
```

The `app_app1`, `app_app2`, and `app_app3` apps are test apps used to validate repeated app installation, route scanning, middleware behavior, isolated app runtime behavior, and WebSocket behavior across multiple apps.

## App Kit Shape

Each test app follows the current app-kit directory shape:

```text
app_app1/
├── .ehecoatl/
├── app/
│   ├── http/
│   │   ├── actions/
│   │   └── middlewares/
│   └── ws/
│       ├── actions/
│       └── middlewares/
│
├── assets/
│   ├── i18n/
│   ├── static/
│   └── templates/
│
├── config/
│   └── default.json
│
├── routes/
│   ├── http/
│   │   └── base.json
│   └── ws/
│       └── base.json
│
├── storage/
├── README.md
└── index.js
```

The important distinction is:

- tenant config lives at the tenant root as `config.json`
- each app has its own app root folder, such as `app_app1`
- app-specific config lives under the app root in `config/`
- app routes live under the app root in `routes/`
- app actions live under the app root in `app/http/actions/` and `app/ws/actions/`
- app assets live under the app root in `assets/`

## Default App

The default app is:

```text
app_www
```

Its HTTP route map is intentionally minimal:

```json
{
  "/": {
    "pointsTo": "asset > static/index.htm"
  }
}
```

This app validates the default tenant app fallback and basic static asset delivery.

## Test Apps

The test apps are:

```text
app_app1
app_app2
app_app3
```

They are built-in live demos for:

- static asset routes
- `.e.htm` template rendering with route-level `i18n`
- `@markdown(...)` directives inside templates
- browser WebSocket consumption on the public `/ws` route
- middleware-only session, auth, CSRF, and route-driven CORS examples
- action template rendering
- isolated app `boot(context)` behavior
- runtime service access through `context.services`

## Main Demo URLs

After deploying one of the test apps, the main demo routes include:

```text
/
 /htm/index.htm
/htm/template-basic.e.htm
/htm/template-layout.e.htm
/htm/ws-live.htm
/session
/post-data
/action/template?name=Ana
/auth/session
/auth/login
/auth/logout
/auth/protected
/auth/admin
/auth/private/{user_id}
/cors/open
/cors/restricted
/cors/blocked
/cli-run
/debug/crash-loop
/debug/crash-memory
/{action}
```

Depending on the tenant routing mode and selected app, these paths may be reached through the default app domain or through an app-specific path prefix.

## Expected Basic Smoke Flow

Suggested smoke test flow:

1. Open `/`
2. Confirm it redirects or resolves to the app landing route
3. Open `/htm/index.htm`
4. Open `/htm/template-basic.e.htm`
5. Open `/htm/template-layout.e.htm`
6. Open `/action/template?name=Ana`
7. Open `/htm/ws-live.htm`
8. Confirm the browser connects to `/ws`
9. Confirm the page receives one JSON tick message per second while connected
10. Call `/auth/session`
11. Test `/auth/login`
12. Test protected auth routes
13. Test CORS routes
14. Test `POST /post-data`

## HTTP Routes

The main test apps define HTTP routes in:

```text
app_app1/routes/http/base.json
app_app2/routes/http/base.json
app_app3/routes/http/base.json
```

Important route target forms:

```text
run > {resource}@{action}
asset > relative/file.ext
redirect > /some/path
redirect 301 > https://example.com
```

Spaces around `>` are allowed, but the bundled examples use the normalized `type > target` form.

## Static Asset Routes

The test apps include static routes such as:

```json
{
  "/htm/{filename}.htm": {
    "pointsTo": "asset > static/htm/{filename}.htm",
    "cache": "public",
    "methods": ["GET"]
  }
}
```

This validates route-driven static asset serving from the app asset root.

## Template Routes

The test apps include `.e.htm` template routes such as:

```json
{
  "/htm/template-basic.e.htm": {
    "pointsTo": "asset > templates/template-basic.e.htm",
    "cache": "no-cache",
    "methods": ["GET"],
    "i18n": [
      "assets/i18n/shared/common.json",
      "assets/i18n/template-basic.override.json"
    ]
  }
}
```

This validates:

- template rendering
- route-level `i18n`
- app-local asset lookup
- template partial behavior
- runtime rendering of `.e.htm` files

## Action Routes

Action routes use the `run > resource@action` target form.

Example:

```json
{
  "/post-data": {
    "pointsTo": "run > post-data@index",
    "cache": "no-cache",
    "methods": ["POST"],
    "contentTypes": [
      "application/json",
      "application/x-www-form-urlencoded"
    ]
  }
}
```

Expected behavior:

- `POST /post-data` reads and returns parsed request-body data
- `GET /session` returns the current session payload
- `GET /hello` returns a simple JSON hello-world response through the catch-all `/{action}` route

## Action Template Rendering

The route:

```text
/action/template
```

demonstrates first-class template rendering from an HTTP action response.

The action returns a render payload similar to:

```js
{
  status: 200,
  render: {
    template: `templates/action-template.e.htm`,
    view: {
      title: `Action Template Response`
    },
    i18n: [
      `assets/i18n/action-template.override.json`
    ]
  }
}
```

That response is rendered by the normal HTTP action middleware path, not by a separate asset route.

## Middleware Examples

This kit demonstrates shared and app-level middleware behavior for:

- `api`
- `session`
- `guest`
- `auth`
- `csrf`
- `cors`
- `validate`

The shared middleware set demonstrates:

- middleware-owned session persistence backed by cache
- CSRF protection using session token checks
- auth scope enforcement from `sessionData.auth.scopes`
- CORS enforcement from route-level `cors` declarations
- validation of allowed methods and content types

## Session Behavior

`sessionData` is the mutable per-request and per-message session payload object exposed to middlewares and actions.

Current helper surface:

```text
sessionData.get(key, defaultValue?)
sessionData.set(key, value)
sessionData.markDirty()
sessionData.setAuth(...)
sessionData.regenerateCsrfToken()
sessionData.destroySession()
```

Persistence rules:

- session state is cache-backed
- JSON-compatible enumerable values persist
- helper functions do not persist
- keys starting with `__` do not persist
- `sessionData.set(...)` marks the session dirty automatically

HTTP session flow:

- the `session` middleware loads the current session from the cookie-backed cache record
- request-scoped changes are written back at request finish when the session is dirty or newly created

WS session flow:

- the `ws-message` middleware loads the current session snapshot for the WebSocket client
- WS middleware persists session changes after message handling
- WS actions can mutate `sessionData`
- updated session state is fed back into the transport-side session persistence path for later messages

## Auth Routes

The test apps include auth demo routes:

```text
/auth/login
/auth/logout
/auth/session
/auth/protected
/auth/admin
/auth/private/{user_id}
```

Examples:

```json
{
  "/auth/admin": {
    "pointsTo": "run > auth-admin@index",
    "middleware": ["auth", "api"],
    "authScope": "admin",
    "cache": "no-cache",
    "methods": ["GET", "OPTIONS"],
    "cors": [
      "http://example.test",
      "http://www.example.test"
    ]
  }
}
```

Auth-scope examples:

```text
admin
user_{user_id}
```

This validates static auth scopes and route-parameter-based auth scopes.

## CORS Routes

The test apps include CORS demo routes:

```text
/cors/open
/cors/restricted
/cors/blocked
```

Examples:

```json
{
  "/cors/open": {
    "pointsTo": "run > hello@index",
    "middleware": ["cors"],
    "cache": "no-cache",
    "methods": ["GET", "OPTIONS"],
    "cors": ["*"]
  }
}
```

```json
{
  "/cors/restricted": {
    "pointsTo": "run > hello@index",
    "middleware": ["cors"],
    "cache": "no-cache",
    "methods": ["GET", "OPTIONS"],
    "cors": ["http://allowed.example.test"]
  }
}
```

```json
{
  "/cors/blocked": {
    "pointsTo": "run > hello@index",
    "middleware": ["cors"],
    "cache": "no-cache",
    "methods": ["GET", "OPTIONS"]
  }
}
```

This validates that CORS is route-driven and only enforced when the `cors` middleware is present.

## WebSocket Routes

The test apps define WebSocket routes in:

```text
app_app1/routes/ws/base.json
app_app2/routes/ws/base.json
app_app3/routes/ws/base.json
```

Main WS routes:

```text
/ws
/ws/auth
/ws/auth/private/{user_id}
/ws/auth/admin
/ws/auth/admin/{user_id}
```

Example:

```json
{
  "/ws/auth/admin/{user_id}": {
    "authScope": [
      "admin",
      "user_{user_id}"
    ],
    "middlewares": [
      "auth",
      "csrf"
    ],
    "wsActionsAvailable": [
      "hello@index",
      "post-data@index"
    ],
    "description": "Only one admin auth user allowed channel (admin private)"
  }
}
```

This validates:

- public WS channels
- auth-protected WS channels
- private user WS channels
- admin-only WS channels
- CSRF-protected WS channels
- route-scoped WS action allowlists

## WebSocket Demo Behavior

Each test app `index.js` starts a background ticker in `boot()`.

Behavior:

- `boot(context)` receives the isolated runtime context
- the app creates a WebSocket ticker
- every second it calls `services.ws.listChannels()`
- if concrete channels for the app are open, it broadcasts a JSON tick message
- if no channels are open, the tick cycle is a no-op

The tick payload has this shape:

```json
{
  "type": "tick",
  "channelId": "channel-id",
  "appName": "app1",
  "timestampUtc": "2026-01-01T00:00:00.000Z",
  "unixMs": 1767225600000
}
```

## Isolated Runtime Context

Each app runs inside an isolated runtime context.

The same `services` object is passed to:

- `index.js` `boot(context)`
- HTTP actions under `app/http/actions`
- WS actions under `app/ws/actions`

Available services include:

```text
storage
fluentFs
cache
rpc
ws
```

`services.fluentFs` is the preferred way to assemble runtime paths:

```js
services.fluentFs.app.http.actions.path(`hello.js`);
services.fluentFs.assets.static.htm.path(`index.htm`);
services.fluentFs.storage.uploads.path(`file.txt`);
```

Path fallback behavior:

- `app` resolves app-local first, then tenant shared `shared/app`
- `assets` resolves app-local first, then tenant shared assets when available
- `storage` stays app-local only

## Tenant Shared Code

Shared tenant code lives under:

```text
shared/app/
```

Shared code is used as a tenant-level fallback when an app does not ship its own local implementation.

Typical shared locations:

```text
shared/app/http/actions/
shared/app/http/middlewares/
shared/app/ws/actions/
shared/app/ws/middlewares/
shared/app/utils/
shared/app/scripts/
```

This allows apps to stay small while reusing common tenant-level behavior.

## Tenant Nginx Template

The tenant-owned nginx template lives at:

```text
.ehecoatl/lib/nginx.e.conf
```

This template is used by the web-server integration to generate nginx-managed configuration while preserving tenant-owned customization points.

## Cache Behavior

Routes can define cache behavior directly.

Examples:

```json
{
  "cache": "no-cache"
}
```

```json
{
  "cache": "public"
}
```

Use `no-cache` for dynamic action routes, auth/session routes, and template examples that should reflect changes immediately.

Use `public` for static assets that can be safely cached.

## Route Scanning

Route fragments live under each app's `routes/` folder.

Example:

```text
app_app1/routes/http/base.json
app_app1/routes/ws/base.json
```

Each `.json` route file can define part of the app route map and is merged during tenant/app scanning.

## Purpose

Use this repository to validate that Ehecoatl can correctly run a realistic tenant with multiple isolated apps.

This kit is useful for testing:

- tenant creation
- tenant config patching
- app discovery
- default app routing
- path-based app routing
- route fragment merging
- app-local file resolution
- tenant shared fallback resolution
- HTTP middleware chains
- WS middleware chains
- session persistence
- auth scope checks
- CSRF checks
- CORS checks
- template rendering
- static asset serving
- action rendering
- WebSocket broadcast behavior
- app boot lifecycle

## What This Kit Is Not

This is not the Empty Tenant Kit.

The Empty Tenant Kit is the minimal tenant baseline and only defines:

- tenant `config.json`
- `ehecoatlVersion`
- basic shared HTTP middlewares
- basic shared WS middlewares

This test kit intentionally includes real apps, routes, actions, assets, templates, WebSocket demos, and middleware examples.

## License

Apache-2.0.

See `LICENSE` for details.
