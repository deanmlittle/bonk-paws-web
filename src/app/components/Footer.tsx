"use client";

const Footer: React.FC<{}> = () => {
  return (
    <nav
      className="flex flex-col gap-y-2 items-center justify-center p-6 lg:px-8 mt-16 max-w-xs mx-auto"
      aria-label="Footer"
    >
      <a href="/" className="-m-1.5 p-1.5">
        <img
          className="h-10 w-auto"
          src="/logo-horizontal.png"
          alt="BONK PAWS"
        />
      </a>
      <div className="flex justify-center items-center space-x-4 mt-4">
        <a href="https://twitter.com/bonk_inu" target="_blank">
          <img className="h-4 w-auto" src="/twitter.svg" alt="Twitter" />
        </a>
        <a href="https://discord.com/invite/qaQa6M6mN2">
          <img className="h-4 w-auto" src="/discord.svg" alt="Discord" />
        </a>
        <a href="https://medium.com/@bonk_inu">
          <img className="h-4 w-auto" src="/medium.svg" alt="Medium" />
        </a>
      </div>
    </nav>
  );
};

export default Footer;
