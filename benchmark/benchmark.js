const autocannon = require("autocannon");
const fs = require("fs");
const path = require("path");

const BASELINE_URL = "http://localhost:3001/profile";
const JWT_URL = "http://localhost:3000/profile";

const JWT_TOKEN = process.env.JWT_TOKEN;

const concurrencyLevels = [10, 25, 50, 100];
const repetitions = 5;
const duration = 10;

async function runBenchmark(name, url, connections, headers = {}) {
    console.log(
        `\nRunning ${name} | ${connections} connections`
    );

    const result = await autocannon({
        url,
        connections,
        duration,
        pipelining: 1,
        headers
    });

    return {
        configuration: name,
        connections,
        duration,
        requests: result.requests.average,
        latency: {
            average: result.latency.average,
            median: result.latency.p50,
            p97_5: result.latency.p97_5,
            p99: result.latency.p99
        },
        errors: result.errors,
        timeouts: result.timeouts,
        non2xx: result.non2xx
    };
}

async function main() {
    if (!JWT_TOKEN) {
        throw new Error(
            "JWT_TOKEN environment variable is not set."
        );
    }

    const results = [];

    for (const connections of concurrencyLevels) {

        for (let run = 1; run <= repetitions; run++) {

            console.log(
                `\n========== Run ${run}/${repetitions} ==========\n`
            );

            // Baseline
            const baseline = await runBenchmark(
                "baseline",
                BASELINE_URL,
                connections
            );

            baseline.run = run;

            results.push(baseline);

            // Small pause between tests
            await new Promise(resolve => setTimeout(resolve, 2000));

            // JWT
            const jwt = await runBenchmark(
                "jwt",
                JWT_URL,
                connections,
                {
                    Authorization: `Bearer ${JWT_TOKEN}`
                }
            );

            jwt.run = run;

            results.push(jwt);

            // Pause before next repetition
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    const outputDirectory = path.join(__dirname, "../results");

    fs.mkdirSync(outputDirectory, {
        recursive: true
    });

    const outputFile = path.join(
        outputDirectory,
        "benchmark-results.json"
    );

    fs.writeFileSync(
        outputFile,
        JSON.stringify(results, null, 2)
    );

    console.log(
        `\nBenchmark complete. Results saved to: ${outputFile}`
    );
}

main().catch(error => {
    console.error("\nBenchmark failed:");
    console.error(error);
    process.exit(1);
});