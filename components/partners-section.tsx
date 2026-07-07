export function PartnersSection() {
  const partners = [
    { name: "NITI Aayog", category: "Government" },
    { name: "Microsoft", category: "Technology" },
    { name: "ICRISAT", category: "Research" },
    { name: "ITC Limited", category: "Agribusiness" },
    { name: "Mahindra Group", category: "Manufacturing" },
    { name: "World Bank", category: "Finance" },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-white/20 to-background py-20 sm:py-32 dark:via-black/20">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Trusted Partners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Building the future of agriculture with leading organizations
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-white/40 bg-card dark:hover:border-white/20 dark:hover:bg-black/50 flex flex-col items-center justify-center gap-3 min-h-24"
            >
              <div className="text-2xl">🏢</div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-sm">{partner.name}</p>
                <p className="text-xs text-muted-foreground">{partner.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
