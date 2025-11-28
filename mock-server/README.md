BREWLUXE mock server

This is a tiny Python mock server used to test client-side checkout flows locally without needing a full backend.

Endpoints:
- POST /api/payment/create-payment-intent -> returns { id, orderId, clientSecret }
- POST /api/orders -> returns { orderId }

Run locally:

```powershell
# from project root (d:\zoomy project\brewluxe--web)
python .\mock-server\mock_server.py 3000
```

The server responds with CORS headers so the client (served at a different port) can call it from the browser.
