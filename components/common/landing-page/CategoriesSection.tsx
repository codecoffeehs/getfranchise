const categories = [
  "Food & Beverage",
  "Retail",
  "Education",
  "Healthcare",
  "Fitness",
  "Technology",
];

const FranchiseCategoriesSection = () => {
  return (
   <section
      id="categories"
      className="relative border-t border-dashed py-24"
    >
      {/* right-side dots */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.05] -z-10">
        <svg className="h-full w-full">
          <defs>
            <pattern
              id="sideDots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1.5" cy="1.5" r="1.2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sideDots)" />
        </svg>
      </div>
      <div className="mx-auto max-w-6xl px-8">
        <h2 className="mb-4 text-4xl font-bold">
          Explore Franchise Categories
        </h2>
        <p className="mb-12 max-w-2xl text-muted-foreground">
          Discover opportunities across industries with different investment levels.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category}
              className="group cursor-pointer rounded-xl border bg-background p-8 transition hover:border-primary hover:shadow-md"
            >
              <h3 className="text-lg font-semibold">{category}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                View available franchises →
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FranchiseCategoriesSection;
