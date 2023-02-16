import Link from "next/link";
import Image from "next/image";

function Home() {
  return (
    <>
      <section id="hero" className="px-8">
        <div className="flex flex-col items-center md:grid md:grid-cols-12 md:space-x-4">
          <div className="order-2 mt-5 w-full md:col-span-5">
            <h1 className="text-indigo-800 text-center text-2xl font-bold uppercase tracking-wide md:text-left lg:text-4xl xl:text-6xl ">
              Budget Control Application
            </h1>
            <p className="text-gray-700 mt-4">
              Organize each of your project&apos;s budget and make better
              decisions
            </p>
            <div className="space-x-2">
              <Link
                className="bg-indigo-700 text-gray-100 hover:bg-blue-300 hover:text-gray-700 mt-3 inline-block rounded-lg px-8 py-2 font-bold uppercase tracking-wide shadow-lg hover:shadow-none"
                href="#"
              >
                Register
              </Link>
              <Link
                className="bg-gray-300 text-indigo-700 hover:bg-blue-300 hover:text-gray-700 mt-3 inline-block rounded-lg px-8 py-2 font-bold uppercase tracking-wide shadow-lg hover:shadow-none"
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
      <section className="bg-indigo-600">
        <div className="text-gray-100 flex flex-wrap space-y-5 px-8 py-12">
          <article className="bg-indigo-200 text-indigo-600 mx-auto w-44 rounded-xl py-8 px-3 text-center text-xl">
            <p>
              &quot;This app gives me the information I need to make better
              decisions&quot;
            </p>
          </article>
          <article className="bg-indigo-200 text-indigo-600 mx-auto w-44 rounded-xl py-8 px-3 text-center text-xl">
            <p>
              &quot;This app gives me the information I need to make better
              decisions&quot;
            </p>
          </article>
          <article className="bg-indigo-200 text-indigo-600 mx-auto w-44 rounded-xl py-8 px-3 text-center text-xl">
            <p>
              &quot;This app gives me the information I need to make better
              decisions&quot;
            </p>
          </article>
        </div>
      </section>
      <section className="px-8 py-8">
        <h3 className="text-indigo-800 text-center text-lg font-bold uppercase">
          Pricing Options
        </h3>
        <div className="px-8-py-12 flex flex-wrap justify-around space-y-5">
          <div className="border-indigo-800 w-44 rounded-lg border-2">
            <h4 className="px-3 py-2">Entry Level</h4>
            <hr className="border-gray-300 border-b-2" />
            <ul className="decoration-indigo-800 list-inside list-disc p-3">
              <li>Full access</li>
              <li>Up to 5 users</li>
            </ul>
            <hr className="border-gray-300 border-b-2" />
            <h5 className="text-red-600 px-3 py-2">
              $ 15 <span className="text-gray-400">/ month</span>
            </h5>
          </div>
          <div className="border-indigo-800 w-44 rounded-lg border-2">
            <h4 className="px-3 py-2">Mid Level</h4>
            <hr className="border-gray-300 border-b-2" />
            <ul className="list-inside list-disc p-3">
              <li>Full access</li>
              <li>Up to 10 users</li>
            </ul>
            <hr className="border-gray-300 border-b-2" />
            <h5 className="text-red-600 px-3 py-2">
              $ 30 <span className="text-gray-400">/ month</span>
            </h5>
          </div>
          <div className="border-indigo-800 w-44 rounded-lg border-2">
            <h4 className="px-3 py-2">Corporate Level</h4>
            <hr className="border-gray-300 border-b-2" />
            <ul className="list-inside list-disc p-3">
              <li>Full access</li>
              <li>Unlimited users</li>
            </ul>
            <hr className="border-gray-300 border-b-2" />
            <h5 className="text-gray-800 px-3 py-2">Contact us</h5>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
