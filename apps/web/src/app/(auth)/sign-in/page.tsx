import type { Metadata } from "next";
import { withGuest } from "@/components/auth/with-auth";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign in" };

const SignInPage = () => <AuthForm mode="sign-in" />;

export default withGuest(SignInPage);
