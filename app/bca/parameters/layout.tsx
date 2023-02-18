import LinkButton from '@/components/Buttons/LinkButton';

export default function ParametersLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <section className='grid grid-cols-12 text-indigo-800 px-5 min-h-96 space-x-6 mb-5'>
            <article className="col-span-9">
                <div className="mt-5">
                    {/* <div className="flex justify-center"> */}
                        {children}
                    {/* </div> */}
                </div>
            </article>
            <aside className='col-span-3 my-3 text-right flex flex-col'>
                <LinkButton text='Suppliers' buttonColor='bg-dark' textColor='text-light' link='/bca/parameters/supplier' />
                <LinkButton text='Budget Item' buttonColor='bg-dark' textColor='text-light' link='/bca/parameters/budget-item' />
                <LinkButton text='Projects' buttonColor='bg-dark' textColor='text-light' link='/bca/parameters/project' />
                <hr className='border-b-2 border-indigo-200 mt-5 mb-3' />
                <LinkButton text='Parameters Home' buttonColor='bg-dark' textColor='text-light' link='/bca/parameters' />
            </aside>
        </section>
    )
}