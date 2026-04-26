# Backend API Endpoints

This document outlines all the available API endpoints in the Digital Patient Management System backend.

## System
* **`GET /`**
  * **Description**: Basic health check / index route that returns the system status.

## Authentication (`/api/auth`)
* **`POST /api/auth/register`**
  * **Description**: Registers a new user/staff member.
* **`POST /api/auth/login`**
  * **Description**: Authenticates a user and returns a JWT token.
* **`GET /api/auth/me`**
  * **Description**: Retrieves the profile information of the currently authenticated user.

## Patients (`/api/patients`)
* **`POST /api/patients/`**
  * **Description**: Creates a new patient record (also creates an initial visit).
* **`GET /api/patients/`**
  * **Description**: Retrieves a list of patients. Supports search queries like `name`, `whatsapp`, and `patient_id`.
* **`GET /api/patients/<patient_id>`**
  * **Description**: Retrieves the complete details of a specific patient.
* **`PUT /api/patients/<patient_id>`**
  * **Description**: Updates a patient's information or adds a new visit (by passing a `visit` object in the payload).
* **`DELETE /api/patients/<patient_id>`**
  * **Description**: Deletes a patient (Requires Admin role).

## Appointments (`/api/appointments`)
* **`POST /api/appointments/`**
  * **Description**: Creates a new standalone appointment.
* **`GET /api/appointments/`**
  * **Description**: Lists appointments.
* **`PUT /api/appointments/<id>`**
  * **Description**: Updates an existing appointment.
* **`DELETE /api/appointments/<id>`**
  * **Description**: Deletes an appointment.
* **`POST /api/appointments/<id>/send_reminder`**
  * **Description**: Manually triggers a reminder SMS/Email for a specific appointment.

## Medicines (`/api/medicines`)
* **`GET /api/medicines/`**
  * **Description**: Retrieves the inventory/list of available medicines.
* **`POST /api/medicines/`**
  * **Description**: Adds a new medicine to the system.
* **`PUT /api/medicines/<medicine_id>`**
  * **Description**: Updates details of a specific medicine.
* **`DELETE /api/medicines/<medicine_id>`**
  * **Description**: Removes a medicine from the system.

## Reminders (`/api/reminders`)
* **`POST /api/reminders/run`**
  * **Description**: Manually triggers the background reminder scheduler job.

## Uploads (`/api/uploads`)
* **`POST /api/uploads/`**
  * **Description**: Handles file and photo uploads for patient records or treatments.
