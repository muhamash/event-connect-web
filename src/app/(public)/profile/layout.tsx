import { authOptions } from "@/lib/services/auth/auth.option";
import { getUserInfoById } from "@/lib/services/user/user.service";
import { RouteSearchParams } from "@/types/pages.type";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

interface ProfilePageProps {
  searchParams: RouteSearchParams;
}


export async function generateMetadata({
  searchParams,
}: ProfilePageProps): Promise<Metadata> {
  const params = await searchParams; 
  let userId = params?.userId;
  if (Array.isArray(userId)) userId = userId[0];

  if (!userId) {
    const session = await getServerSession(authOptions);
    userId = session?.user?.id;
  }

  if (!userId) return { title: "Profile" };

  const user = (await getUserInfoById(userId))?.data;

  return {
    title: `${user?.fullname} | EventConnect`,
    description: `View the profile of ${user?.fullname} on EventConnect.`,
    openGraph: {
      title: `${user?.fullname} | EventConnect`,
      description: `View the profile of ${user?.fullname} on EventConnect.`,
      images: user?.image
        ? [
            {
              url: user?.image,
              width: 800,
              height: 800,
              alt: `${user?.fullname}'s profile picture`,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user?.fullname} | EventConnect`,
      description: `View the profile of ${user?.fullname} on EventConnect.`,
      images: user?.image ? [user?.image] : [],
    },
  };
}


const ProfileLayout = async({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
    return (
        <>
            {children}
        </>
    );
};

export default ProfileLayout;