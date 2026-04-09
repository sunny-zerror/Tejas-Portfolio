import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import React from 'react'

const navLinks = [
  {
    id: 1,
    label: 'Home',
    href: "/"
  }, {
    id: 2,
    label: "About",
    href: "/about"
  }, {
    id: 3,
    label: "Contact",
    href: "/contact"
  }
]

const Header = () => {
  const pathname = usePathname();
  return (
    <>
      <nav className="fixed pointer-events-none w-full top-0 text-black gap-x-5 font-semibold text-xl py-5! left-0 z-20 padding flex items-center">
        {navLinks.map((link) => (
          <Link href={link.href} key={link.id} className={` pointer-events-auto ${pathname === link.href ? "opacity-100" : "opacity-50"}`}>{link.label}</Link>
        ))}
      </nav>
    </>
  )
}

export default Header