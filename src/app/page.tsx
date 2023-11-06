import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="h-screen w-screen bg-cyan-100 flex justify-center">
        <Link href={"/chat"}>
          <p className="pt-10 text-xl font-mono text-red-500">Go to chats</p>
        </Link>
      </div>
    </>
  );
}
