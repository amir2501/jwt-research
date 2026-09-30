import json
from collections import defaultdict
import statistics


def load_data(filename):
    with open(filename, "r") as file:
        return json.load(file)


def group_results(data):
    groups = defaultdict(list)

    for result in data:
        key = (
            result["configuration"],
            result["connections"]
        )

        groups[key].append(result)

    return groups


def get_metric_values(results, metric):
    values = []

    for result in results:

        if metric == "throughput":
            values.append(result["requests"])

        elif metric == "latency":
            values.append(result["latency"]["average"])

        elif metric == "p99":
            values.append(result["latency"]["p99"])

    return values


def calculate_statistics(values):
    mean = sum(values) / len(values)
    std_dev = statistics.stdev(values)

    return mean, std_dev


def analyze_metric(groups, metric):
    results = {}

    for key, group in groups.items():

        values = get_metric_values(
            group,
            metric
        )

        mean, std_dev = calculate_statistics(
            values
        )

        results[key] = {
            "values": values,
            "mean": mean,
            "std_dev": std_dev
        }

    return results