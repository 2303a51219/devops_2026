# Personal Finance Tracker — CI Demo

This repository contains a minimal React frontend with unit tests and a GitHub Actions CI workflow.

> NOTE: Replace `<OWNER>/<REPO>` in the badge URL below with your GitHub repo path.


![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)

## What the workflow does
- Trigger: `push` and `pull_request` on `main`/`master`
- Steps:
  - Checkout
  - Setup Node.js 18
  - Install dependencies (frontend)
  - Run tests
  - Build frontend

The pipeline fails if tests fail.
