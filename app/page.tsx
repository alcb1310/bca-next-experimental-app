import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={inter.className}>
      <h1 className="mx-auto px-4 text-3xl font-bold uppercase text-label">
        Welcome to BCA
      </h1>
      <p className="mx-auto px-4 text-base font-bold text-dark">home page</p>
    </main>
  );
}
