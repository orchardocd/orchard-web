# Donations

Donation buttons link to `/donate`. The form offers one-off donations in GBP, with
£5, £10, £25, £50 and £100 presets and custom amounts from £1 to £10,000.
Stripe Checkout collects payment details on Stripe’s hosted page. Card details
never pass through this application.
Checkout accepts cards and supported card wallets. Delayed payment methods are
not enabled.

Set these server environment variables before starting the application:

| Variable            | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `STRIPE_SECRET_KEY` | Stripe account secret key; use a test key for development   |
| `SITE_URL`          | Canonical site origin, for example `https://orchardocd.org` |

`SITE_URL` must use HTTPS except on localhost. It must not contain a path, query
or fragment. No publishable key, preconfigured product or payment link is needed.
The application returns HTTP 503 when configuration is missing or invalid.
Deployment retrieves the `secret-key` field from the `prod/orchard-web/stripe`
secret in AWS Secrets Manager in `us-east-1` and sets `SITE_URL` to
`https://new.orchardocd.org`. The deploying AWS identity needs permission to read
and decrypt that secret. Keep the secret key out of source control.

The deployment runs `scripts/configure-stripe.mjs` as the `orchard` service user.
Its arguments are the existing environment file path and canonical site origin;
it reads the secret key from standard input. It validates the inputs before
atomically updating `/srv/orchard/app.env` with mode `0600`, replacing duplicate
donation settings and preserving unrelated settings. Invalid input, ambiguous
quoted values or multiline donation settings stop deployment before the file is
changed. The environment file must be a regular file owned by the service user.

The server creates a Checkout Session with an inline GBP price and donation
metadata. Retries with the same amount and request ID reuse Stripe’s idempotency
key. A canceled checkout returns to the form. After payment, the confirmation
page retrieves the session from Stripe and displays success only when the
matching donation is paid. Pending payments can be checked again.

Stripe holds donation records. Enable successful-payment receipts in the Stripe
Dashboard if automatic email receipts are wanted. The website does not send
receipts, store donor records, collect Gift Aid declarations or create recurring
donations. If local records or other post-payment actions are added, implement a
verified, idempotent webhook handler; a browser return is not reliable fulfillment.

Integration tests exercise the HTTP route with only Stripe’s network boundary
mocked. Browser tests exercise amount selection, redirect, cancellation and
confirmation. Before enabling live payments, complete a sandbox checkout,
declined payment and authentication flow using Stripe test payment details.

- [Checkout Sessions](https://docs.stripe.com/api/checkout/sessions/create)
- [Confirmation pages](https://docs.stripe.com/payments/checkout/custom-success-page?payment-ui=stripe-hosted)
- [Idempotent requests](https://docs.stripe.com/api/idempotent_requests)
- [Stripe testing](https://docs.stripe.com/testing)
- [Receipts](https://docs.stripe.com/receipts)
