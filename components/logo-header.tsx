import Link from "next/link"
import { Logo } from "./logo"

export const LogoHeader = () => {
  return (
    <div className="fixed z-50 pt-4 md:pt-6 top-0 left-0 px-6 md:px-12 lg:px-16">
      <Link href="/">
        <Logo className="w-[100px] md:w-[120px]" />
      </Link>
    </div>
  )
}
