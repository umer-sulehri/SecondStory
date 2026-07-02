import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My profile</h1>
        <p className="mt-1 text-text-secondary">
          Manage your personal information.
        </p>
      </div>

      <ProfileForm
        initial={{
          name: profile?.name ?? "",
          email: profile?.email ?? user?.email ?? "",
          phone: profile?.phone ?? "",
        }}
      />
    </div>
  );
}
