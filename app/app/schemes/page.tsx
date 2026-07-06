import { Suspense } from "react"
import { Search, Filter, BookOpen, Zap } from "lucide-react"
import { getSchemes, getSchemeCategories, getFarmerSchemeApplications } from "@/lib/schemes/queries"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

async function SchemeList() {
  try {
    const schemes = await getSchemes({ limit: 12 })

    if (!schemes.length) {
      return (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p>No government schemes available at the moment</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{scheme.name}</CardTitle>
                  <CardDescription className="mt-1">{scheme.code} • {scheme.department}</CardDescription>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {scheme.level}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheme.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2">{scheme.summary}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {scheme.tags?.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-muted-foreground">
                  {scheme.application_start && (
                    <>Apply by {new Date(scheme.application_end || "").toLocaleDateString("en-IN")}</>
                  )}
                </div>
                <Button size="sm" variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch (error) {
    return <div className="text-red-500">Error loading schemes</div>
  }
}

async function FarmerApplications() {
  try {
    const applications = await getFarmerSchemeApplications()

    if (!applications.length) return null

    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Your Applications
          </CardTitle>
          <CardDescription>Track your government scheme applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{app.scheme?.name}</p>
                  <p className="text-xs text-muted-foreground">{app.reference_no}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.status === "approved" ? "bg-green-100 text-green-700" :
                    app.status === "rejected" ? "bg-red-100 text-red-700" :
                    app.status === "submitted" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    return null
  }
}

async function SchemeCategories() {
  try {
    const categories = await getSchemeCategories()

    return (
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className="p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
          >
            {cat.icon && <div className="text-2xl mb-1">{cat.icon}</div>}
            <p className="text-xs font-medium line-clamp-2">{cat.name}</p>
          </button>
        ))}
      </div>
    )
  } catch (error) {
    return null
  }
}

export default function SchemesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Government Schemes
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover and apply for government assistance programs designed for farmers
        </p>
      </div>

      <Suspense fallback={<div>Loading applications...</div>}>
        <FarmerApplications />
      </Suspense>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Search schemes..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
        <Suspense fallback={<div>Loading categories...</div>}>
          <SchemeCategories />
        </Suspense>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Available Schemes</h2>
        <Suspense fallback={<div>Loading schemes...</div>}>
          <SchemeList />
        </Suspense>
      </div>
    </div>
  )
}
