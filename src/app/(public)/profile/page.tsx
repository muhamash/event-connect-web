import Profile from "@/components/modules/profile/ProfileContainer";
import ProfileSkeleton from "@/components/skeletons/ProfilePageSkeleton";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getUserInfoById } from "@/lib/services/user/user.service";
import { RouteSearchParams } from "@/types/pages.type";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

interface ProfilePageProps {
  searchParams: RouteSearchParams;
}

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps) {
  const params = await searchParams; 
  let userId = params?.userId;
  if (Array.isArray(userId)) userId = userId[0];

  if (!userId) {
    const session = await getServerSession(authOptions);
    userId = session?.user?.id;
  }

  const userPromise = getUserInfoById(userId!);

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile userId={userId} userPromise={userPromise} />
    </Suspense>
  );
}