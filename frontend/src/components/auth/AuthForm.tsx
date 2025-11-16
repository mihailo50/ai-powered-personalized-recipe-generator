"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const redirectTo = `${siteUrl.replace(/\/$/, "")}/dashboard`;

export function AuthForm() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div>
      <Auth
        supabaseClient={supabase}
        view="sign_in"
        providers={[]}
        redirectTo={redirectTo}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#6B46C1",
                brandAccent: "#8B5CF6",
              },
              space: {
                buttonPadding: "12px 24px",
              },
              radii: {
                borderRadiusButton: "8px",
                inputBorderRadius: "8px",
              },
            },
          },
        }}
      />
    </div>
  );
}

