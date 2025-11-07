import { Suspense } from 'react'
import SearchContent from './SearchContent'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Searching...</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}