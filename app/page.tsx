import Link from "next/link"
import Image from "next/image"

function Home() {
  return (
    <>
      <section id="hero" className="px-8">
        <div className="flex flex-col items-center md:grid md:grid-cols-12 md:space-x-4">
          <div className="order-2 mt-5 w-full md:col-span-5">
            <h1 className="text-center text-2xl font-bold uppercase tracking-wide text-dark md:text-left lg:text-4xl xl:text-6xl ">
              Budget Control Application
            </h1>
            <p className="mt-4 text-label">
              Organize each of your project&apos;s budget and make better
              decisions
            </p>
            <div className="space-x-2">
              <Link
                className="mt-3 inline-block rounded-lg bg-dark px-8 py-2 font-bold uppercase tracking-wide text-gray-100 shadow-lg hover:bg-blue-300 hover:text-label hover:shadow-none"
                href="#"
              >
                Register
              </Link>
              <Link
                className="mt-3 inline-block rounded-lg bg-gray-300 px-8 py-2 font-bold uppercase tracking-wide text-dark shadow-lg hover:bg-blue-300 hover:text-label hover:shadow-none"
                href="/login"
              >
                Login
              </Link>
            </div>
          </div>
          <Image
            className="order-1 w-full object-fill md:order-5 md:col-span-7"
            src="/images/hero-image.jpg"
            alt="BCA hero"
            width={200}
            height={200}
          />
        </div>
      </section>
      <section className="bg-dark">
        <div className="flex flex-wrap space-y-5 px-8 py-12 text-gray-100">
          <article className="mx-auto w-44 rounded-xl bg-light py-8 px-3 text-center text-xl text-dark">
            <p>
              &quot;This app gives me the information I need to make better
              decisions&quot;
            </p>
          </article>
          <article className="mx-auto w-44 rounded-xl bg-light py-8 px-3 text-center text-xl text-dark">
            <p>
              &quot;This app gives me the information I need to make better
              decisions&quot;
            </p>
          </article>
          <article className="mx-auto w-44 rounded-xl bg-light py-8 px-3 text-center text-xl text-dark">
            <p>
              &quot;This app gives me the information I need to make better
              decisions&quot;
            </p>
          </article>
        </div>
      </section>
      <section className="px-8 py-8">
        <h3 className="text-center text-lg font-bold uppercase text-dark">
          Pricing Options
        </h3>
        <div className="px-8-py-12 flex flex-wrap justify-around space-y-5">
          <div className="w-44 rounded-lg border-2 border-dark">
            <h4 className="px-3 py-2">Entry Level</h4>
            <hr className="border-b-2 border-gray-300" />
            <ul className="list-inside list-disc p-3 decoration-dark">
              <li>Full access</li>
              <li>Up to 5 users</li>
            </ul>
            <hr className="border-b-2 border-gray-300" />
            <h5 className="px-3 py-2 text-red-600">
              $ 15 <span className="text-gray-400">/ month</span>
            </h5>
          </div>
          <div className="w-44 rounded-lg border-2 border-dark">
            <h4 className="px-3 py-2">Mid Level</h4>
            <hr className="border-b-2 border-gray-300" />
            <ul className="list-inside list-disc p-3">
              <li>Full access</li>
              <li>Up to 10 users</li>
            </ul>
            <hr className="border-b-2 border-gray-300" />
            <h5 className="px-3 py-2 text-red-600">
              $ 30 <span className="text-gray-400">/ month</span>
            </h5>
          </div>
          <div className="w-44 rounded-lg border-2 border-dark">
            <h4 className="px-3 py-2">Corporate Level</h4>
            <hr className="border-b-2 border-gray-300" />
            <ul className="list-inside list-disc p-3">
              <li>Full access</li>
              <li>Unlimited users</li>
            </ul>
            <hr className="border-b-2 border-gray-300" />
            <h5 className="px-3 py-2 text-gray-800">Contact us</h5>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
