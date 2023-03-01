import Image from "next/image"

export default function ReportsHome() {
  return (
    <div className="flex justify-center">
      <div className="container w-2/3">
        <Image
          src="/images/reports-background.jpg"
          alt="Report main page"
          className="w-full rounded-lg shadow-2xl"
        />
      </div>
    </div>
  )
}
