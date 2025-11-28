#!/usr/bin/env python3
"""
Lightweight mock server for BREWLUXE client testing.
Provides two endpoints used by the client-side app:
- POST /api/payment/create-payment-intent
- POST /api/orders

This server adds simple CORS headers so the client (served on a different port) can call it from the browser.
Run: python mock-server\mock_server.py 3000
"""
import sys
import json
import random
import string
from http.server import HTTPServer, BaseHTTPRequestHandler


def gen_id(prefix='ID'):
    return f"{prefix}_{''.join(random.choices(string.ascii_uppercase + string.digits, k=8))}"


class MockHandler(BaseHTTPRequestHandler):
    def _set_cors_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        # allow all origins for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_cors_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        raw = self.rfile.read(length) if length else b''
        try:
            body = json.loads(raw.decode('utf-8')) if raw else {}
        except Exception:
            body = {}

        if self.path == '/api/payment/create-payment-intent':
            print('\n[MockServer] /api/payment/create-payment-intent called')
            print('[MockServer] Request body:', body)
            resp = {
                'id': gen_id('pi'),
                'orderId': gen_id('ORD'),
                'clientSecret': gen_id('cs')
            }
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(resp).encode('utf-8'))
            return

        if self.path == '/api/orders':
            print('\n[MockServer] /api/orders called')
            print('[MockServer] Request body:', body)
            resp = { 'orderId': gen_id('ORD') }
            self._set_cors_headers(200)
            self.wfile.write(json.dumps(resp).encode('utf-8'))
            return

        # Not found
        self._set_cors_headers(404)
        self.wfile.write(json.dumps({'error': 'Not found'}).encode('utf-8'))

    def log_message(self, format, *args):
        # reduce default logging noise
        print("[MockServer] %s - - %s" % (self.address_string(), format%args))


def run(port=3000):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, MockHandler)
    print(f"[MockServer] Serving on http://127.0.0.1:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n[MockServer] Shutting down')
        httpd.server_close()


if __name__ == '__main__':
    port = 3000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run(port)
