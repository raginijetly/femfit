import { UI_DELAY } from "@/utils/constants";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sunrise,
  Sun,
  Apple,
  Moon,
  HelpCircle,
  Leaf,
  Loader2,
} from "lucide-react";

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

  // return (
  //   <div className="gradient-primary flex h-screen flex-col items-center justify-center">
  //     {/* Main content */}
  //     <main className="container mx-auto px-4 py-8 pb-20 text-black">
  //       <div className="overflow-hidden rounded-xl bg-white shadow-lg">
  //         <div className="bg-purple-100 p-6">
  //           <h2 className="flex items-center text-2xl font-bold text-purple-800">
  //             <Utensils className="mr-2 h-6 w-6" />
  //             Nutrition
  //           </h2>
  //           <p className="mt-2 text-purple-700">
  //             Food recommendations for your cycle
  //           </p>
  //         </div>

  //         <div className="p-8 text-center">
  //           <div className="mx-auto max-w-md">
  //             <h3 className="text-brand-dark mb-4 text-3xl font-semibold">
  //               Coming Soon
  //             </h3>
  //             <p className="mb-6 text-gray-600">
  //               Nutrition features will be available in the next update. When
  //               launched, you'll have access to:
  //             </p>

  //             <ul className="mb-8 space-y-3 text-left">
  //               <li className="flex items-start">
  //                 <svg
  //                   className="mr-2 h-6 w-6 text-purple-500"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth="2"
  //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  //                   />
  //                 </svg>
  //                 <span>
  //                   Personalized meal plans tailored to each phase of your cycle
  //                 </span>
  //               </li>
  //               <li className="flex items-start">
  //                 <svg
  //                   className="mr-2 h-6 w-6 text-purple-500"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth="2"
  //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  //                   />
  //                 </svg>
  //                 <span>
  //                   Recipes that support hormone balance and reduce
  //                   uncomfortable symptoms
  //                 </span>
  //               </li>
  //               <li className="flex items-start">
  //                 <svg
  //                   className="mr-2 h-6 w-6 text-purple-500"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth="2"
  //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  //                   />
  //                 </svg>
  //                 <span>
  //                   Nutritional guidance on which foods help or hurt specific
  //                   symptoms
  //                 </span>
  //               </li>
  //               <li className="flex items-start">
  //                 <svg
  //                   className="mr-2 h-6 w-6 text-purple-500"
  //                   fill="none"
  //                   viewBox="0 0 24 24"
  //                   stroke="currentColor"
  //                 >
  //                   <path
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth="2"
  //                     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  //                   />
  //                 </svg>
  //                 <span>
  //                   Shopping lists and easy meal prep options to support your
  //                   health
  //                 </span>
  //               </li>
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // );

  return (
    <div className="mx-auto min-h-screen max-w-3xl space-y-5 p-4 py-24">
      {/* Cycle Phase Status */}
      <Card className="border-0 bg-white/95 px-5 py-5 shadow-lg backdrop-blur-sm">
        <CardContent className="px-0 py-0">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Ovulatory Phase
              </h2>
              <p className="font-medium text-purple-600">
                Peak energy, ideal for strength and intensity
              </p>
            </div>
            <div className="flex w-22 shrink-0 flex-col items-center gap-2">
              <div className="flex size-14 items-center justify-center rounded-full bg-purple-100">
                <span className="text-lg font-bold text-purple-600">16</span>
              </div>
              <p className="text-xs text-gray-500">Day of cycle</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Nutrition */}
      <Card className="border-0 bg-white/95 px-5 py-5 shadow-lg backdrop-blur-sm">
        <CardContent className="flex flex-col gap-5 px-0 py-0">
          <div className="flex items-center justify-between gap-3 px-3">
            <div className="text-2xl">🥗</div>
            <h2 className="text-center text-xl font-bold text-gray-800">
              TODAY'S NUTRITION FOCUS
            </h2>
            <div className="text-2xl">🥗</div>
          </div>

          <div className="rounded-lg bg-emerald-100 p-4">
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Foods to Boost Energy & Support Metabolism
            </h3>
            <p className="mb-3 text-gray-700 italic">
              "Today, feeling 'Energetic', prioritize nutrient-dense foods to
              fuel your high activity and support metabolism."
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-green-600 text-green-100"
              >
                <Leaf className="mr-1 h-4 w-4" />
                Complex carbs
              </Badge>
              <Badge variant="secondary" className="bg-blue-600 text-blue-100">
                Lean proteins
              </Badge>
              <Badge
                variant="secondary"
                className="bg-yellow-600 text-yellow-100"
              >
                Vitamin-B
              </Badge>
            </div>
          </div>

          {/* Why This Nutrition */}
          <div className="rounded-lg bg-blue-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h4 className="text-xl font-semibold text-blue-800">
                WHY THIS NUTRITION?
              </h4>
            </div>
            <p className="text-sm leading-relaxed font-medium text-blue-700">
              During the Follicular phase, rising estrogen levels mean your body
              is primed for building muscle. Complex carbs provide sustained
              energy for workouts, while lean proteins support muscle repair. As
              a 'Vegetarian', ensuring adequate plant-based protein is key.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Meal Sections */}
      <Card className="border-0 bg-white/95 px-5 py-5 shadow-lg backdrop-blur-sm">
        <CardContent className="flex flex-col gap-5 px-0 py-0">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            {/* Breakfast */}
            <div className="flex flex-col gap-3 rounded-lg bg-orange-100 p-4 md:h-auto md:w-1/2">
              <div className="flex items-center justify-between gap-3 px-5">
                <Sunrise className="h-5 w-5 fill-orange-500 text-orange-500" />
                <h4 className="text-xl font-bold text-gray-800">BREAKFAST</h4>
                <Sunrise className="h-5 w-5 fill-orange-500 text-orange-500" />
              </div>
              <div className="">
                <p className="font-medium text-gray-800">
                  • Oatmeal with berries and nuts
                </p>
              </div>
              <p className="mt-auto text-sm text-orange-700 italic">
                <strong>Why:</strong> Provides sustained morning energy and
                fiber.
              </p>
            </div>
            {/* Lunch */}
            <div className="flex flex-col gap-3 rounded-lg bg-yellow-100 p-4 md:h-auto md:w-1/2">
              <div className="flex items-center justify-between gap-3 px-5">
                <Sun className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <h4 className="text-xl font-bold text-gray-800">LUNCH</h4>
                <Sun className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              </div>
              <div className="">
                <p className="font-medium text-gray-800">
                  • Quinoa salad with grilled tofu and veggies
                </p>
              </div>
              <p className="mt-auto text-sm text-yellow-700 italic">
                <strong>Why:</strong> A balanced meal for sustained energy
                through the afternoon.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row">
            {/* Snack */}
            <div className="flex flex-col gap-3 rounded-lg bg-red-100 p-4 md:h-auto md:w-1/2">
              <div className="flex items-center justify-between gap-3 px-5">
                <Apple className="h-5 w-5 fill-red-500 text-red-500" />
                <h4 className="text-xl font-bold text-gray-800">SNACK</h4>
                <Apple className="h-5 w-5 fill-red-500 text-red-500" />
              </div>
              <div className="">
                <p className="font-medium text-gray-800">
                  • Apple slices with almond butter
                </p>
              </div>
              <p className="mt-auto text-sm text-red-700 italic">
                <strong>Why:</strong> Healthy fats and fiber for satiety.
              </p>
            </div>
            {/* Dinner */}
            <div className="flex flex-col gap-3 rounded-lg bg-indigo-100 p-4 md:h-auto md:w-1/2">
              <div className="flex items-center justify-between gap-3 px-5">
                <Moon className="h-5 w-5 fill-indigo-500 text-indigo-500" />
                <h4 className="text-xl font-bold text-gray-800">DINNER</h4>
                <Moon className="h-5 w-5 fill-indigo-500 text-indigo-500" />
              </div>
              <div className="">
                <p className="font-medium text-gray-800">
                  • Lentil & spinach curry with brown rice
                </p>
              </div>
              <p className="mt-auto text-sm text-indigo-700 italic">
                <strong>Why:</strong> Replenishes nutrients and provides complex
                carbohydrates for recovery.
              </p>
            </div>
          </div>

          {/* Log Meals Button */}
          <Button className="gradient-primary w-full text-white hover:opacity-90">
            Log Today's Meals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionPage;
