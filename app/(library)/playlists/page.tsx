import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle } from "lucide-react";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
}

const PlaylistsPage = () => {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState<Video[]>([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPlaylists([
        {
          id: "1",
          title: "Amazing Video Title 1",
          thumbnail: "/api/placeholder/320/180",
          duration: "10:30",
          views: "1.2M"
        },
        // Add more videos as needed
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Your Playlists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton loading state
          [...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : (
          // Actual content
          playlists.map((video) => (
            <div key={video.id} className="group relative">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <PlayCircle className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-12 h-12" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  {video.duration}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-white">{video.title}</h3>
              <p className="text-gray-400">{video.views} views</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;