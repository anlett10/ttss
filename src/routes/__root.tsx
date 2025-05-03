// app/routes/__root.tsx

import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  ClientOnly,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { HydrationCheck } from '@/components/HydrationCheck';
import appCss from '../index.css?url';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { getAuth } from '@clerk/tanstack-react-start/server';
import {
  ClerkLoaded,
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/tanstack-react-start';
import { DefaultCatchBoundary } from '@/components/DefaultCatchBoundary';
import { NotFound } from '@/components/NotFound';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useEffect, useState } from 'react';

// ✅ Auth fetch function
const fetchClerkAuth = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await getAuth(getWebRequest()!);
  return { userId };
});

// ✅ Root route definition
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    title: 'TanStack Start Starter',
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  beforeLoad: async () => {
    const { userId } = await fetchClerkAuth();
    return { userId };
  },

  errorComponent: (props) => (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  ),

  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

// ✅ Root layout component
function RootComponent() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <ClerkProvider>
      <RootDocument>
        <header className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <div className="text-lg font-semibold dark:text-white">📝 ts</div>
          <div className="flex items-center gap-2">
            <ClientOnly>
              <DarkModeToggle />
            </ClientOnly>
            <ClerkLoaded>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" />
              </SignedOut>
            </ClerkLoaded>
          </div>
        </header>

        <nav className="p-4 space-x-4 text-sm sm:text-base bg-gray-100 dark:bg-gray-800 dark:text-gray-100">
          <Link to="/" className="[&.active]:font-bold">Home</Link>
          <Link to="/about" className="[&.active]:font-bold">About</Link>
          <Link to="/todos" className="[&.active]:font-bold">TODO</Link>
        </nav>

        <main className="p-4 min-h-[60vh] bg-white dark:bg-gray-900 dark:text-gray-100">
          <Outlet />
        </main>

        <footer className="text-center text-sm py-4 text-gray-500 dark:text-gray-400">
          © {year ?? '...'} TSS & Triplit App.
        </footer>

        <HydrationCheck />
      </RootDocument>
    </ClerkProvider>
  );
}

// ✅ HTML document wrapper
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
