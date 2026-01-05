import EditProfile from "@/components/modules/profile/EditProfileContainer";
import EditProfileSkeleton from "@/components/skeletons/EditProfileSkeleton";
import { authOptions } from "@/lib/services/auth/auth.option";
import { getUserInfoById } from "@/lib/services/user/user.service";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export default async function ProfileEditPage ()
{
  
  const session = await getServerSession(authOptions);
  const userPromise = getUserInfoById( session?.user?.id );
  
  return (
    <Suspense fallback={<EditProfileSkeleton/>}>
      <EditProfile  userPromise={userPromise}/>
    </Suspense>
  )
}