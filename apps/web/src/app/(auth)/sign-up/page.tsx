import type { Metadata } from "next";
import { withGuest } from "@/components/auth/with-auth";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Create account" };

const SignUpPage = () => <AuthForm mode="sign-up" />;

export default withGuest(SignUpPage);
