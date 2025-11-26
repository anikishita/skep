import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                riot: {
                    dark: '#010101', // Almost black background
                    panel: '#111111', // Dark panel
                    sidebar: '#0f1112', // Sidebar background
                    accent: '#d0a85c', // Gold/Hextech
                    highlight: '#0ac8b9', // Cyan/Neon
                    text: '#f0f0f0', // White text
                    muted: '#939393', // Gray text
                    danger: '#e84057', // Red
                    hover: '#1e1e1e', // Hover state
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hextech': 'linear-gradient(135deg, #1e2328 0%, #0a0a0c 100%)',
                'hero-gradient': 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)',
            },
        },
    },
    plugins: [],
}
export default config
