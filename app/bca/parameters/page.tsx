import Image from "next/image"

export default function ParametersHome() {
  return (
    <div className="flex justify-center">
      <div className="container w-2/3">
        <Image
          src="/images/parameters-background.jpg"
          alt="main page"
          className="w-full rounded-lg shadow-2xl"
          width={200}
          height={200}
        />
      </div>
    </div>
  )
}
