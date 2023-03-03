import LinkButton from "@/components/Buttons/LinkButton"

export default function ParametersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-96 mb-5 grid grid-cols-12 space-x-6 px-5 text-indigo-800">
      <article className="col-span-9">
        <div className="mt-5">{children}</div>
      </article>
      <aside className="col-span-3 my-3 flex flex-col text-right">
        <LinkButton
          text="Budget"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/transactions/budget"
        />
        <LinkButton
          text="Invoice"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/transactions/invoice"
        />
        <LinkButton
          text="Monthly Closure"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/transactions/closure"
        />
        <hr className="mt-5 mb-3 border-b-2 border-indigo-200" />
        <LinkButton
          text="Transactions Home"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/transactions"
        />
      </aside>
    </section>
  )
}
