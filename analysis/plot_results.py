import matplotlib.pyplot as plt

from analyze import (
    load_data,
    group_results,
    analyze_metric
)

data = load_data(
    "results/benchmark-results.json"
)

groups = group_results(data)

throughput_results = analyze_metric(
    groups,
    "throughput"
)

latency_results = analyze_metric(
    groups,
    "latency"
)

p99_results = analyze_metric(
    groups,
    "p99"
)


def plot_metric(
        results,
        ylabel,
        title,
        filename
):

    concurrency = [10, 25, 50, 100]

    baseline_values = []
    jwt_values = []

    baseline_errors = []
    jwt_errors = []

    for connections in concurrency:

        baseline_values.append(
            results[
                ("baseline", connections)
            ]["mean"]
        )

        jwt_values.append(
            results[
                ("jwt", connections)
            ]["mean"]
        )

        baseline_errors.append(
            results[
                ("baseline", connections)
            ]["std_dev"]
        )

        jwt_errors.append(
            results[
                ("jwt", connections)
            ]["std_dev"]
        )

    plt.figure(figsize=(10, 6))

    plt.errorbar(
        concurrency,
        baseline_values,
        yerr=baseline_errors,
        marker="o",
        capsize=4,
        label="Baseline"
    )

    plt.errorbar(
        concurrency,
        jwt_values,
        yerr=jwt_errors,
        marker="o",
        capsize=4,
        label="JWT"
    )

    plt.xlabel("Concurrent connections")
    plt.ylabel(ylabel)
    plt.title(title)

    plt.legend()
    plt.grid(True)

    plt.tight_layout()

    plt.savefig(
        f"figures/{filename}",
        dpi=300
    )

    plt.show()

plot_metric(
    throughput_results,
    "Throughput (requests/sec)",
    "Throughput vs. Concurrent Connections",
    "throughput.png"
)

plot_metric(
    latency_results,
    "Average latency (ms)",
    "Average Latency vs. Concurrent Connections",
    "latency.png"
)

plot_metric(
    p99_results,
    "P99 latency (ms)",
    "P99 Latency vs. Concurrent Connections",
    "p99-latency.png"
)
