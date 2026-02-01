'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MobileNav() {
  return (
    <div className="md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/" className="w-full cursor-pointer">
              Home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/guests" className="w-full cursor-pointer">
              Guests
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/checklist" className="w-full cursor-pointer">
              Checklist
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/calendar" className="w-full cursor-pointer">
              Calendar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/vendors" className="w-full cursor-pointer">
              Vendors
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
