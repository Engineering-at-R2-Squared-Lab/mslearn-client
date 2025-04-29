import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-[#0078d4] rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">ML</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Sign in
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to Microsoft Learn Copilot
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-[#0078d4] hover:text-[#106ebe] font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Microsoft. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
