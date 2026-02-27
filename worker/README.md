# Online Judge Worker

This worker is a generic code execution engine written in Rust. It consumes submission jobs from a Redis queue, executes the code in isolated Docker containers, and updates the results in a PostgreSQL database.

## Architecture

![Architecture](https://mermaid.ink/img/pako:eNqNkk1PwzAMhv9K5HMToT1w4TAkDo0D44DQOMClS9M1WuS4SD9Q9b8Ttx00JIS4WPb1K4_tOaOUViglY2q_GlVj_Kj1kTO22-1oR_a7HW1eX-nd45PePj_p7fOT8vi0o93LzsAZMyQ1lF_wQ1FqXUFLqV_QWqmc1r9Q2hjaQGv1w-f4i5_gB_iB-AE_ED_gB-IH_OA1PrxWfMQP-IH4AT94Xb8hfsAPxM_4QdFf8YMiyg-K6Ab8oIg24AdFtAE_KKIN-EERbcAPimjD9fwgefoLfC9--Auy29fXN1osFpROp5ROfiibzSifn9F8Pqf5fE7L5ZKWyyWlp6f0vFzS83JJ6fExPT090fPzMz0_P9PLywstLy+0vLzQanVN69U1rVbXtF5d03p1Tev1Na3X1/T6-kqvr6/0-vpKr6vVf5_2P877H-f9j1P_49T_OPU_Tv2PU__j1P849T9O_Y9T/+PU_zj1P079j1P_49T_OPU_Tv2PU__j1P849T9O_Y9T/+PU_zj1P079j1P_49T_OPU_Tv2PU__j1P849T9O_Y9T/+PU//g_ov8B-1i7fQ)
*(Note: Mermaid diagram source below)*

```mermaid
graph TD
    A[Redis Queue] -->|Pop Submission ID| B(Worker Service)
    B -->|Fetch Code & Test Cases| C[(Postgres DB)]
    B -->|Create Temp Dir| D{Language?}
    D -->|Python| E[Docker: python-runner]
    D -->|C++| F[Docker: cpp-runner]
    E -->|Execute & Capture Output| G[Verdict Logic]
    F -->|Compile & Execute| G
    G -->|Compare with Expected| H{Match?}
    H -->|Yes| I[Update DB: Accepted]
    H -->|No| J[Update DB: Wrong Answer]
    G -->|Error/Timeout| K[Update DB: Error/TLE]
```

## How It Works (Step-by-Step)

1.  **Job Pickup**: The worker listens on a Redis queue (`brpop`). When a web server pushes a `submission_id`, the worker picks it up immediately.
2.  **Data Fetching**: It uses the ID to query the Postgres database for:
    *   **The Code**: What the user wrote.
    *   **The Language**: Python, C++, etc.
    *   **Test Cases**: Inputs and expected outputs.
3.  **Isolation (Docker)**:
    *   The worker creates a unique temporary folder on the host machine.
    *   It writes the user's code into this folder (e.g., `solution.py`).
    *   It spins up a **Docker container** with network disabled (for security).
    *   It mounts the temporary folder into the container so the code is visible inside.
4.  **Execution**:
    *   **Python**: Runs `python solution.py` inside the container.
    *   **C++**: First runs `g++` to compile, then runs the binary.
    *   Input is piped into standard input (stdin).
    *   Output is captured from standard output (stdout).
5.  **Judging**: The worker compares the container's output (stdout) against the database's `expected_output`.
    *   **Accepted**: Output matches perfectly (ignoring trailing whitespace).
    *   **Wrong Answer**: Output is different.
    *   **Time Limit Exceeded**: The process took too long.
    *   **Runtime Error**: The code crashed (non-zero exit code).
6.  **Result**: The final verdict and execution stats (time/memory) are saved back to Postgres.

## Directory Structure

*   `src/main.rs`: Entry point. Initializes config, DB, and starts the worker.
*   `src/services/queue.rs`: Handles Redis communication.
*   `src/services/executor.rs`: The core logic. Handles Docker creation, file mounting, and running code.
*   `src/models/`: Data structures matching your DB tables.

## Docker Images
The system relies on two custom images which must be built locally:
*   `klaus-judge-python`: For Python execution.
*   `klaus-judge-cpp`: For C++ compilation and execution.
