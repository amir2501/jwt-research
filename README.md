# Performance Overhead of JWT-Based Authentication in REST APIs

A small experimental research project investigating the performance overhead introduced by JWT-based authentication in a Node.js REST API.

## Research Question

> What performance overhead does JWT-based authentication introduce when processing authenticated REST API requests compared with an equivalent unauthenticated baseline?

### Secondary Research Question

> How does the overhead vary under increasing concurrent request loads?

### Hypothesis

JWT-based authentication introduces measurable request-processing overhead compared with an equivalent unauthenticated baseline.

---

## Project Overview

This project compares two REST API implementations:

1. **Unauthenticated baseline** — processes requests without authentication.
2. **JWT-authenticated API** — validates a JSON Web Token before processing the same request.

Both implementations provide the same `/profile` endpoint and return an equivalent response structure. This allows the experiment to focus on the performance difference associated with JWT authentication.

The experiment measures:

- Throughput
- Average latency
- P99 latency

The APIs are tested under increasing levels of concurrent connections.

---

## Experimental Design

The benchmark uses four concurrency levels:

| Concurrent Connections | Repetitions | Duration per Run |
|---:|---:|---:|
| 10 | 5 | 10 seconds |
| 25 | 5 | 10 seconds |
| 50 | 5 | 10 seconds |
| 100 | 5 | 10 seconds |

Both the baseline and JWT implementations are tested under each configuration.

This produces:

**2 implementations × 4 concurrency levels × 5 repetitions = 40 benchmark runs**

Pipelining is set to `1`, meaning each connection maintains one outstanding request at a time.

---

## Results Summary

Under the tested local environment, the JWT-authenticated implementation showed lower throughput and higher latency than the unauthenticated baseline.

### Mean Throughput

| Connections | Baseline (req/s) | JWT (req/s) |
|---:|---:|---:|
| 10 | 18,710.14 | 3,834.39 |
| 25 | 18,467.06 | 3,822.31 |
| 50 | 18,451.06 | 3,814.35 |
| 100 | 18,256.15 | 3,824.20 |

The JWT implementation produced approximately **79% lower throughput** than the baseline across the tested concurrency levels.

### Mean Average Latency

| Connections | Baseline (ms) | JWT (ms) |
|---:|---:|---:|
| 10 | 0.022 | 2.242 |
| 25 | 1.060 | 6.276 |
| 50 | 2.182 | 12.538 |
| 100 | 5.066 | 25.680 |

### Mean P99 Latency

| Connections | Baseline (ms) | JWT (ms) |
|---:|---:|---:|
| 10 | 1.0 | 4.0 |
| 25 | 2.0 | 12.0 |
| 50 | 4.4 | 25.0 |
| 100 | 6.4 | 37.8 |

These results indicate a measurable performance difference between the two implementations under the tested conditions.

---

## Research Paper

The full research paper is available here:

[Read the Research Paper](paper/Performance_Overhead_JWT_REST_APIs.pdf)

---

## Publication Status

This paper is an independent experimental research study.

The repository contains the source code, benchmark configuration,
raw experimental results and analysis scripts required to reproduce
the reported experiment.

The paper is provided as a publicly accessible research manuscript.

---

## Project Structure

```text
jwt-research/
│
├── src/
│   ├── server.js
│   ├── baseline.js
│   └── auth.js
│
├── benchmark/
│   └── benchmark.js
│
├── results/
│   └── benchmark-results.json
│
├── analysis/
│   ├── analyze.py
│   └── plot_results.py
│
├── figures/
│   ├── throughput.png
│   ├── latency.png
│   └── p99-latency.png
│
├── tests/
│
├── .env
├── .gitignore
├── package.json
└── package-lock.json