const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <>
      <section className="mb-[100vh]"></section>
      <footer className="fixed w-full bg-secondary bottom-0 -z-10 flex flex-col items-center justify-between h-screen px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <a href="#" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">FalcoTech</span>
          </a>
          <nav className="flex space-x-4"></nav>
        </div>
        <div className="w-full border-t py-4 text-xs text-muted-foreground">
          <h3>&copy;{year} FalcoTech. Todos los derechos reservados.</h3>
        </div>
      </footer>
    </>
  );
};

export default Footer;
