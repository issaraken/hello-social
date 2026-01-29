import ChatWindow from "@components/ChatWindow";

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center p-4">
    <div className="w-full max-w-lg h-[600px]">
      <ChatWindow className="h-full" />
    </div>
  </div>
);

export default Home;
