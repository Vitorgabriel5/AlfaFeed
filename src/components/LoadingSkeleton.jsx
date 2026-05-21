function PostSkeleton() {
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 px-4 py-4 animate-pulse">
      <div className="flex gap-3">
        <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex gap-4 mt-3">
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="space-y-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
      <div className="px-6 pb-6">
        <div className="-mt-12 flex items-end justify-between">
          <div className="h-24 w-24 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-gray-800"></div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex gap-6">
            <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { PostSkeleton, FeedSkeleton, ProfileSkeleton, ChatSkeleton };