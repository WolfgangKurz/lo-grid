import path from "path";

import { defineConfig, loadEnv } from "vite";
import preact from "@preact/preset-vite";

export default ({ mode }) => {
	const viteEnv = loadEnv(mode, process.cwd());

	const isProd = mode === "production";
	const isDev = !isProd;

	const prependData = `${[
		"@charset \"UTF-8\";",
		"@use \"sass:math\";",
		"@use \"sass:list\";",
		"@use \"sass:map\";",
		`$NODE_ENV: "${mode}";`,
		`$LOCALHOST: "${viteEnv.VITE_LOCALHOST || ""}:${viteEnv.VITE_ASSET_PORT}";`,
		`@import "${path.resolve(__dirname, "src", "themes", "base").replace(/\\/g, "/")}";`,
	].join("\n")}\n`;

	return defineConfig({
		esbuild: {
			jsxFactory: "h",
			jsxFragment: "Fragment",
			// jsxInject: `import { h, Fragment } from "preact";`,
			logOverride: {
				"this-is-undefined-in-esm": "silent",
			},
		},
		build: {
			assetsDir: "build",
			polyfillModulePreload: false,
			reportCompressedSize: false,

			minify: isProd,
			sourcemap: isDev,

			rollupOptions: {
				output: {
					inlineDynamicImports: false,
					manualChunks (id) {
						// entry
						if (
							id.includes("/src/components/app.") ||
							id.includes("/src/components/dynamic-route/")
						) return undefined;

						// vendor
						if (id.includes("/node_modules/bootstrap")) return "vendor.bootstrap";
						if (id.includes("/node_modules/html2canvas/")) return "vendor.html2canvas";
						if (id.includes("/node_modules/")) return "vendor";

						// types & libs -> base
						if (id.includes("/src/types/")) return "base";
						if (id.includes("/src/libs/")) return "base";

						// components
						if (
							id.includes("/src/components/locale/") ||
							id.includes("/src/components/loader/") ||
							id.includes("/src/components/redirect/")
						) return "components.base";
						if (id.includes("/src/components/bootstrap-")) return "components.bootstrap";
						if (id.includes("/src/components/")) return "components";

						// // routes
						if (id.includes("/src/routes/")) return "routes";
					},
				},
			},
		},
		server: {
			fs: {
				allow: [__dirname],
			},
		},
		css: {
			preprocessorOptions: {
				css: {
					charset: false,
				},
				sass: {
					charset: false,
					additionalData: prependData,
				},
				scss: {
					charset: false,
					additionalData: prependData,
				},
			},
		},
		plugins: [preact()],
		resolve: {
			alias: {
				"@/": `${path.resolve(__dirname, "src")}/`,
				react: "preact/compat",
				"react-dom": "preact/compat",
			},
		},
	});
};
