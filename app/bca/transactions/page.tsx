import Image from "next/image"

export default function TransactionsHome() {
  return (
    <div className="flex justify-center">
      <div className="container w-2/3">
        <Image
          src="/images/transactions-background.jpg"
          alt="main image"
          className="w-full rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
