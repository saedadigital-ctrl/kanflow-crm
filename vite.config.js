import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];
export default defineConfig({
    plugins,
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "client", "src"),
            "@shared": path.resolve(import.meta.dirname, "shared"),
            "@assets": path.resolve(import.meta.dirname, "attached_assets"),
        },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client", "public"),
    build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'vendor-react';
                        if (id.includes('@radix-ui')) return 'vendor-ui';
                        if (id.includes('@dnd-kit')) return 'vendor-dnd';
                        if (id.includes('wouter') || id.includes('sonner')) return 'vendor-other';
                        return 'vendor-common';
                    }
                    if (id.includes('Dashboard.tsx')) return 'feature-dashboard';
                    if (id.includes('Pipeline.tsx')) return 'feature-pipeline';
                    if (id.includes('Contacts.tsx')) return 'feature-contacts';
                    if (id.includes('Chats.tsx')) return 'feature-chats';
                    if (id.includes('AdminPanel.tsx')) return 'feature-admin';
                    if (id.includes('Settings.tsx')) return 'feature-settings';
                    if (id.includes('AIAgents.tsx')) return 'feature-ai';
                    if (id.includes('Automations.tsx')) return 'feature-automations';
                },
                // Optimize chunk naming
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },
    server: {
        host: true,
        allowedHosts: [
            ".manuspre.computer",
            ".manus.computer",
            ".manus-asia.computer",
            ".manuscomputer.ai",
            ".manusvm.computer",
            "localhost",
            "127.0.0.1",
        ],
        fs: {
            strict: true,
            deny: ["**/.*"],
        },
    },
});
