import { SignUp } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"

export default function SignUpPage() {
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up"

  return (
    <AuthShell
      title="Design systems at the speed of thought."
      description="Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time."
    >
      <SignUp
        path={signUpUrl}
        signInUrl={signInUrl}
        forceRedirectUrl="/editor"
      />
    </AuthShell>
  )
}
