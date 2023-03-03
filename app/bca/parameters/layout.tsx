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
          text="Suppliers"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/parameters/supplier"
        />
        <LinkButton
          text="Budget Item"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/parameters/budget-item"
        />
        <LinkButton
          text="Projects"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/parameters/project"
        />
        <hr className="mt-5 mb-3 border-b-2 border-indigo-200" />
        <LinkButton
          text="Parameters Home"
          buttonColor="bg-dark"
          textColor="text-light"
          link="/bca/parameters"
        />
      </aside>
    </section>
  )
}
