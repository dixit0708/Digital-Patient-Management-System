#!/usr/bin/env python
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

print("\n=== Testing JWT Fix ===\n")

# 1. Login
print("1. Login...")
login_res = requests.post(f"{BASE_URL}/api/auth/login", json={"username": "admin", "password": "adminpass"})
print(f"   Status: {login_res.status_code}")
if login_res.status_code == 200:
    token = login_res.json()["access_token"]
    print(f"   Token: {token[:40]}...")
else:
    print(f"   Error: {login_res.text}")
    exit(1)

# 2. Get patients (protected)
print("\n2. GET /api/patients...")
headers = {"Authorization": f"Bearer {token}"}
res = requests.get(f"{BASE_URL}/api/patients", headers=headers)
print(f"   Status: {res.status_code}")
print(f"   Response: {res.text[:200]}")

# 3. Create patient (protected)
print("\n3. POST /api/patients...")
patient_data = {
    "full_name": "Test Patient",
    "whatsapp": "+919876543210",
    "treatment_type": "Cupping"
}
res = requests.post(f"{BASE_URL}/api/patients", json=patient_data, headers=headers)
print(f"   Status: {res.status_code}")
print(f"   Response: {res.text[:300]}")

print("\n=== Tests Complete ===\n")
