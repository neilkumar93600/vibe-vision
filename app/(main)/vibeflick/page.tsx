import { Layout } from "@/components/layout/layout";
import { SparklesCore } from "@/components/ui/sparkles";
import { ShortsPlayer } from "@/components/viveflicks-player";

const demoShort = {
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Why did Scott Lang bring an orange slice for Clint in Endgame???",
    channelName: "APieceOfMovie",
    likes: "667K",
    comments: "445",
    views: "2.3M",
    postedDate: "2 days ago",
    channelAvatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&auto=format&fit=crop",
    hashtags: ["#Marvel", "#Endgame", "#ScottLang"],
    description: "In this video, we dive deep into the hilarious yet mysterious orange slice scene from Endgame. Is there a deeper meaning behind Scott Lang's gesture?",
    duration: "01:23",
    isVerified: true, // Indicates if the channel is verified
    category: "Entertainment",
    shareCount: "123K",
};


export default function Home() {
    return (
        <Layout>
            <main className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="absolute inset-0 z-0">
                    <SparklesCore
                        id="forgot-password-sparkles"
                        background="purple"
                        minSize={0.6}
                        maxSize={1.4}
                        particleDensity={100}
                        particleColor="#FFFFFF"
                    />
                </div>
                <ShortsPlayer {...demoShort} />
            </main>
        </Layout>
    );
}