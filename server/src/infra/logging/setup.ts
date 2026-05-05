import { configure, getConsoleSink } from "@logtape/logtape";
import { getPrettyFormatter } from "@logtape/pretty";

export async function setupLogging() {
  const isProd = process.env.NODE_ENV === "production";

  await configure({
    sinks: {
      console: getConsoleSink({
        formatter: isProd ? undefined : getPrettyFormatter({ properties: true }),
      }),
    },
    loggers: [
      { category: [], sinks: ["console"], lowestLevel: isProd ? "info" : "debug" },
      { category: ["express"], sinks: ["console"], lowestLevel: "info" },
      { category: ["app"], sinks: ["console"], lowestLevel: isProd ? "info" : "debug" },
      { category: ["logtape", "meta"], sinks: ["console"], lowestLevel: "warning" },
    ],
  });
}
