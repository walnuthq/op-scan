import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Search from "@/components/lib/navbar/search";
import ModeToggle from "@/components/lib/navbar/mode-toggle";
import UserMenu from "@/components/lib/navbar/user-menu";
import logoImg from "@/img/logo.png";

const Navbar = () => (
  <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      <Link
        href="/"
        className="flex size-10 items-center gap-2 text-lg font-semibold md:text-base"
      >
        <Image src={logoImg} alt="OP Scan logo" className="size-8" />
        <span className="sr-only">OP Scan</span>
      </Link>
      <Link
        href="/"
        className="text-foreground transition-colors hover:text-foreground"
      >
        Home
      </Link>
    </nav>
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Image src={logoImg} alt="OP Scan logo" className="size-8" />
            <span className="sr-only">OP Scan</span>
          </Link>
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <Search />
      <ModeToggle />
      <UserMenu />
    </div>
  </header>
);

export default Navbar;
