import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import { MobileNav } from '@/components/mobile-nav';
import { NavLink } from '@/components/nav-link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'To The Altar',
  description: 'Your complete wedding planning companion',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="border-b">
              <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <Link href="/" className="font-semibold text-xl tracking-tight">
                    To The Altar
                  </Link>
                  <div className="hidden md:flex gap-3 ml-4">
                    <NavLink href="/">Home</NavLink>
                    <NavLink href="/guests">Guests</NavLink>
                    <NavLink href="/events">Events</NavLink>
                    <NavLink href="/checklist">Checklist</NavLink>
                    <NavLink href="/venues">Venues</NavLink>
                    <NavLink href="/calendar">Calendar</NavLink>
                    <NavLink href="/vendors">Vendors</NavLink>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <ModeToggle />
                  <MobileNav />
                </div>
              </nav>
            </header>
            <main>{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
