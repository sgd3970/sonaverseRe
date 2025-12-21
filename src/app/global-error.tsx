'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-red-500 text-7xl mb-4">
                            error
                        </span>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">
                            Something went wrong!
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We apologize for the inconvenience. An unexpected error has occurred.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
