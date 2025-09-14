export default function Page() {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
          <h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Transform your business with AI-powered consulting
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform provides tailored consulting solutions to help your business
            grow, innovate, and succeed in the digital age.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="/auth/login"
              className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Get started
            </a>
            <a href="/about" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
          <div className="relative mx-auto w-[364px] max-w-full">
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500/50 to-purple-500/50 [mask-image:radial-gradient(closest-side,white,transparent)] sm:right-8">
              <div className="aspect-[2/1] w-[200px] bg-gradient-to-br from-blue-500 to-purple-500 opacity-40 blur-2xl"></div>
            </div>
            <div className="relative rounded-2xl bg-white p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="h-2 w-16 rounded bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                </div>
                <div className="h-8 w-full rounded bg-blue-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Deploy faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage AI consulting
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools and insights you need to leverage AI for your business.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'AI-Powered Analysis',
                description:
                  'Get deep insights into your business data with our advanced AI analysis tools.',
              },
              {
                title: 'Custom Recommendations',
                description:
                  'Receive personalized recommendations based on your specific business needs and goals.',
              },
              {
                title: 'Real-time Collaboration',
                description:
                  'Work together with your team and AI consultants in real-time to implement solutions.',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
