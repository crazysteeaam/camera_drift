/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'film': {
                    50: '#fefefe',
                    100: '#fdfcfc',
                    200: '#faf8f8',
                    300: '#f5f2f2',
                    400: '#ede8e8',
                    500: '#d8d0d0',
                    600: '#b8acac',
                    700: '#9a8a8a',
                    800: '#7f7171',
                    900: '#6a5e5e',
                    950: '#3a3232',
                },
                'vintage': {
                    50: '#fef7ee',
                    100: '#fdecd3',
                    200: '#fbd5a5',
                    300: '#f8b86d',
                    400: '#f59532',
                    500: '#f27a0a',
                    600: '#e35f05',
                    700: '#bc4708',
                    800: '#96380e',
                    900: '#7a300f',
                    950: '#421705',
                }
            },
            fontFamily: {
                'serif': ['Georgia', 'serif'],
                'mono': ['Courier New', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'film-roll': 'filmRoll 20s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                filmRoll: {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-100%)' },
                }
            },
            backgroundImage: {
                'film-texture': "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"3\" cy=\"3\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
            }
        },
    },
    plugins: [],
} 