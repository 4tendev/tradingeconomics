import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Image
            width={200}
            height={200}
            alt="Good Comparison Image"
            src="/Comparison.jpg"
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">
              {"Let's Compare Everything!"}
            </h1>
            <p className="py-6">Uncompared data is Stupid DATA !!!.</p>
            <Link href={"/compare"} className="btn btn-primary">
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
