import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="p-[1.5px] rounded-[10px] bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]">
      <ul className="flex items-center rounded-[10px] bg-black">
        <li className="relative flex items-center after:content-[''] after:h-[34px] after:w-[1.5px] after:bg-[#c65dc2] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] last:after:hidden">
          <Link
            className="px-[29.68px] py-[8.8px] text-customPink-100"
            href="/audio"
          >
            Features
          </Link>
        </li>
        <li className="relative flex items-center after:content-[''] after:h-[34px] after:w-[1.5px] after:bg-[#68aad9] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] last:after:hidden">
          <Link
            className="px-[29.68px] py-[8.8px] text-white"
            href="/customers"
          >
            Customers
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            className="px-[29.68px] py-[8.8px] text-white"
            href="/integrations"
          >
            Integrations
          </Link>
        </li>
      </ul>
    </nav>
  );
}
