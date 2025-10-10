import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Pokedex App',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className='min-h-screen bg-background text-foreground font-mono'>
          <header className='pt-24'>
            <h1 className='w-fit mx-auto'>
              <Link to="/" className="block text-6xl font-bold text-primary mb-8 hover:underline focus-within:underline underline-offset-6 decoration-4 cursor-pointer">
                Pokedex App
              </Link>
            </h1>
          </header>
          <main className="size-full px-6 pb-24">
            {children}
          </main>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
