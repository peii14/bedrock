import { FormSkeleton } from "@/components/ui/skeleton";

const AuthLoading = () => (
  <div className="rounded-3xl bg-surface p-6">
    <FormSkeleton fields={2} />
  </div>
);

export default AuthLoading;
