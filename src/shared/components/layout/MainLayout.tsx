import { Header } from "./Header"
import { Footer } from "./Footer"
import { SkipLink } from "../a11y/SkipLink"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-white">
            <SkipLink />
            <Header />
            <main id="main-content" className="flex-grow pt-0" tabIndex={-1}>
                {children}
            </main>
            <Footer />
        </div>
    )
}
