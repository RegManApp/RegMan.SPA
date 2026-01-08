import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "strip-signalr-pure-annotations",
        enforce: "pre",
        transform(code, id) {
          if (id.includes("@microsoft/signalr/dist/esm/Utils.js")) {
            // Rollup warns about these annotations in this file; it removes them anyway.
            // Stripping them pre-transform avoids noisy build warnings without changing behavior.
            return code.replaceAll("/*#__PURE__*/", "");
          }

          return null;
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split app code into stable chunks to keep any single file under the warning threshold.
            // This does not change runtime behavior; it only affects bundling.
            if (id.includes("/src/")) {
              if (id.includes("/src/pages/")) return "pages";
              if (id.includes("/src/components/")) return "components";
              if (id.includes("/src/api/")) return "api";
              if (id.includes("/src/context") || id.includes("/src/contexts/"))
                return "state";
              if (id.includes("/src/hooks/")) return "hooks";
              if (id.includes("/src/utils/")) return "utils";
              if (id.includes("/src/i18n/")) return "i18n";

              return "app";
            }

            if (!id.includes("node_modules")) return;

            if (id.includes("@microsoft/signalr")) return "signalr";
            if (id.includes("recharts") || id.includes("/d3-")) return "charts";
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("react-router")
            ) {
              return "react";
            }
            if (
              id.includes("@headlessui") ||
              id.includes("@heroicons") ||
              id.includes("react-icons")
            ) {
              return "ui";
            }

            return "vendor";
          },
        },
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: true,
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      },
    },
  };
});
