import { UI_DELAY } from "@/utils/constants";
import { Loader2, Utensils } from "lucide-react";
import { useEffect, useState } from "react";

const NutritionPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  // Simulate loading state for API Delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, UI_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="gradient-primary flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="gradient-primary flex h-screen flex-col items-center justify-center">
      {/* Main content */}
      <main className="container mx-auto px-4 py-8 pb-20 text-black">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="bg-purple-100 p-6">
            <h2 className="flex items-center text-2xl font-bold text-purple-800">
              <Utensils className="mr-2 h-6 w-6" />
              Nutrition
            </h2>
            <p className="mt-2 text-purple-700">
              Food recommendations for your cycle
            </p>
          </div>

          <div className="p-8 text-center">
            <div className="mx-auto max-w-md">
              <h3 className="mb-4 text-xl font-semibold">Coming Soon</h3>
              <p className="mb-6 text-gray-600">
                Nutrition features will be available in the next update. When
                launched, you'll have access to:
              </p>

              <ul className="mb-8 space-y-3 text-left">
                <li className="flex items-start">
                  <svg
                    className="mr-2 h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Personalized meal plans tailored to each phase of your cycle
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Recipes that support hormone balance and reduce
                    uncomfortable symptoms
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Nutritional guidance on which foods help or hurt specific
                    symptoms
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="mr-2 h-6 w-6 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Shopping lists and easy meal prep options to support your
                    health
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NutritionPage;
