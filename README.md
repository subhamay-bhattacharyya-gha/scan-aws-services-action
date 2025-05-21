# Scan AWS Services Action

![Release](https://github.com/subhamay-bhattacharyya-gha/scan-aws-services-action/actions/workflows/release.yaml/badge.svg)&nbsp;![Commit Activity](https://img.shields.io/github/commit-activity/t/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![Last Commit](https://img.shields.io/github/last-commit/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![Release Date](https://img.shields.io/github/release-date/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![Repo Size](https://img.shields.io/github/repo-size/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![File Count](https://img.shields.io/github/directory-file-count/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![Issues](https://img.shields.io/github/issues/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![Top Language](https://img.shields.io/github/languages/top/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![Commit Activity Monthly](https://img.shields.io/github/commit-activity/m/subhamay-bhattacharyya-gha/scan-aws-services-action)&nbsp;![Custom Endpoint](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/bsubhamay/b6d056e46abb7865dfe07f867fdbd6a4/raw/scan-aws-services-action.json?)

## 📦 Overview

This GitHub Action scans your repository to detect whether specific AWS services are being used. It checks for code or configuration files commonly associated with:

- AWS Lambda (Python, JavaScript, TypeScript)
- AWS Glue (Python)
- Step Functions (ASL JSON)
- Lambda Layers (Python, JavaScript, TypeScript)

Use this in CI workflows to inform deployment steps, enforce compliance, or audit infrastructure.

---

## ✅ Features

- Detects Lambda code in `lambda/src`
- Detects Glue scripts in `glue/script`
- Detects Step Functions definitions in `state-machine`
- Scans `python-layer` for Lambda Layer languages
- Outputs structured JSON with all detected services

---

## 📤 Outputs

| Name            | Description                                         |
|-----------------|-----------------------------------------------------|
| `services-used` | JSON object showing which AWS services were found   |

### Example Output

```json
{
  "lambda-python": true,
  "lambda-js": false,
  "lambda-ts": true,
  "glue-python": true,
  "state-machine": false,
  "python-layer-python": false,
  "python-layer-js": false,
  "python-layer-ts": true
}
```

---

## 🚀 Example Usage

```yaml
name: Detect AWS Services

on:
  push:
    branches: [main]

jobs:
  detect-services:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Scan AWS Services
        id: scan
        uses: subhamay-bhattacharyya-gha/scan-aws-services-action@main

      - name: Print Output
        run: echo "Detected Services: ${{ steps.scan.outputs.services-used }}"
```

---

## 🛠 Local Development

To test or develop this action locally:

1. Clone the repo
2. Run `node main.js` from the project root
3. Ensure the expected folders (`lambda/src`, `glue/script`, etc.) exist for testing
4. Review the console output for service detection results

You can also test it inside a GitHub workflow by referencing the action locally:

```yaml
- name: Test Local Action
  uses: ./  # Use local path for testing
```

---

## 🤝 Contributing

We welcome contributions! You can help by:

- Reporting bugs
- Suggesting features
- Writing docs
- Submitting PRs

Check out the [CONTRIBUTING.md](./CONTRIBUTING.md) guide to get started. Please also read our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## 🕘 Version History

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

Latest versions:

- `v1.0.1`: Added pre-commit hooks
- `v1.0.0`: Initial release

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
