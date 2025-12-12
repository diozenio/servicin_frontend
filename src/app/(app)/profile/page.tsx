import { UserProfile } from "@/components/user-profile";

export default async function Profile({}) {

  return (
    <div className="min-h-svh">
      <div className="flex flex-col gap-4 p-6 md:p-10 max-h-screen">

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full">
            <UserProfile/>
          </div>
        </div>
      </div>
    </div>
  );
}
