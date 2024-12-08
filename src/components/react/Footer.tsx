import { routeList } from "./Navbar";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="py-6 md:py-12">
      <div className="container max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2">
          <span className="text-lg font-semibold">FalcoTech</span>
        </a>
        <nav className="flex flex-wrap items-center gap-4 md:gap-6">
          <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
            {routeList.map(({ href, label }, i) => (
              <li key={i}>
                <a
                  className="text-[--foreground-color] transition hover:text-gray-700/75"
                  href={href}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {year}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
