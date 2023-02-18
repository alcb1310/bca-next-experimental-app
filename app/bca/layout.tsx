import NavBar from "@/components/NavBar";

export default function BcaLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <NavBar />
            {children}
        </>
    )
}