import { UI_DELAY } from "@/utils/constants";
import {
  Play,
  Clock,
  Flame,
  HelpCircle,
  Target,
  Zap,
  Loader2,
  Pause,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Numbering from "@/components/ui/Numbering";

const WorkoutPage: React.FC = () => {
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
  //             <Dumbbell className="mr-2 h-6 w-6" />
  //             Workouts
  //           </h2>
  //           <p className="mt-2 text-purple-700">Tailored to your cycle phase</p>
  //         </div>

  //         <div className="p-8 text-center">
  //           <div className="mx-auto max-w-md">
  //             <h3 className="text-brand-dark mb-4 text-3xl font-semibold">
  //               Coming Soon
  //             </h3>
  //             <p className="mb-6 text-gray-600">
  //               Workout content will be available in the next update. When
  //               launched, you'll be able to:
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
  //                   Access workouts specifically designed for each phase of your
  //                   cycle
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
  //                   Follow along with guided video routines led by women
  //                   trainers
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
  //                   Adjust intensity levels based on your energy and how you're
  //                   feeling
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
  //                   Track your progress and sync with your cycle data for
  //                   optimal results
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
    <div className="mx-auto min-h-screen max-w-3xl p-4 py-24">
      {/* Cycle Phase Status */}
      <Card className="mb-6 border-0 bg-white/95 px-5 py-5 shadow-lg backdrop-blur-sm">
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

      {/* Today's Workout */}
      <Card className="mb-6 border-0 bg-white/95 px-5 py-5 shadow-lg backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="mb-3 flex items-center justify-between gap-3 px-5">
            <Flame className="size-8 fill-orange-500 text-orange-500" />
            <h2 className="text-center text-xl font-bold text-gray-800">
              TODAY'S RECOMMENDED WORKOUT
            </h2>
            <Flame className="size-8 fill-orange-500 text-orange-500" />
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-4">
            <h3 className="text-center text-xl font-semibold text-gray-800">
              HIIT Strength Training
            </h3>
            <div className="flex w-full items-center justify-between gap-4">
              <Badge
                variant="secondary"
                className="bg-purple-600 font-semibold text-purple-100"
              >
                <Clock className="mr-1 h-4 w-4" />
                25 min
              </Badge>
              <Badge
                variant="secondary"
                className="bg-orange-600 font-semibold text-orange-100"
              >
                <Zap className="mr-1 h-4 w-4" />
                High energy phase
              </Badge>
            </div>
            <p className="text-gray-700">
              "Designed for your 'Already Active' level and 'Energetic' mood,
              this session will help you push limits and build strength."
            </p>
          </div>

          {/* Why This Workout */}
          <div className="rounded-lg bg-blue-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h4 className="text-xl font-semibold text-blue-800">
                WHY THIS WORKOUT?
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                <p className="text-sm leading-relaxed font-medium text-blue-800">
                  During your Ovulatory phase, estrogen levels peak, providing
                  maximum strength and endurance
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                <p className="text-sm leading-relaxed font-medium text-blue-800">
                  This makes it ideal for explosive movements and high-intensity
                  training
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></div>
                <p className="text-sm leading-relaxed font-medium text-blue-800">
                  For PCOS, consistent strength training helps improve insulin
                  sensitivity
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Sections */}
      <Card className="border-0 bg-white/95 px-5 py-5 shadow-lg backdrop-blur-sm">
        <CardContent className="flex flex-col gap-5 p-0 text-black">
          {/* Warm-up */}
          <div>
            <div className="mb-1 flex items-center justify-between gap-3 px-5">
              <Play className="h-5 w-5 fill-green-600 text-green-600" />
              <h3 className="flex flex-col items-center text-xl font-bold text-gray-800 md:flex-row md:gap-3">
                WARM-UP <span className="text-lg font-semibold">(5 min)</span>
              </h3>
              <Play className="h-5 w-5 fill-green-600 text-green-600" />
            </div>
            <div className="rounded-lg bg-green-100 p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Numbering number={1} bgColor="bg-green-500" />
                  Dynamic Arm Circles (10x Fwd/Bwd) 🔄
                </li>
                <li className="flex items-center gap-2">
                  <Numbering number={2} bgColor="bg-green-500" />
                  Cat-Cow Stretch (8x) 🐱
                </li>
                <li className="flex items-center gap-2">
                  <Numbering number={3} bgColor="bg-green-500" />
                  Leg Swings (8x each leg) 🦵
                </li>
              </ul>
            </div>
          </div>

          {/* Main Workout */}
          <div>
            <div className="mb-1 flex items-center justify-between gap-3 px-5">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="flex flex-col items-center text-xl font-bold text-gray-800 md:flex-row md:gap-3">
                MAIN WORKOUT
                <span className="text-lg font-semibold">(20 min)</span>
              </h3>
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div className="rounded-lg bg-purple-100 p-4">
              <div className="flex flex-col">
                <div>
                  <p className="text-center text-lg font-semibold text-purple-700">
                    CIRCUIT 1
                  </p>
                  <p className="mb-4 font-normal text-purple-700">
                    (Repeat 3x; Rest 60 seconds after each round)
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Numbering number={1} />
                      <span className="text-sm">Squats (12 reps) 🏋️‍♀️</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Numbering number={2} />
                      <span className="text-sm">
                        Push-ups (10 reps or Knee Push-ups) 💪
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Numbering number={3} />
                      <span className="text-sm">Plank (45 sec hold) 🧘‍♀️</span>
                    </div>
                  </div>
                </div>
                <Separator className="mt-5 mb-3 rounded-2xl bg-purple-600/75" />
                <div>
                  <p className="text-center text-lg font-semibold text-purple-700">
                    CIRCUIT 2
                  </p>
                  <p className="mb-4 font-normal text-purple-700">
                    (Repeat 2x; Rest 60 seconds after each round)
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Numbering number={1} />
                      <span className="text-sm">
                        Dumbbell Rows (10 reps each arm) 🏋️
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Numbering number={2} />
                      <span className="text-sm">
                        Shoulder Press (10 reps) 💪
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cool-down */}
          <div>
            <div className="mb-1 flex items-center justify-between gap-3 px-5">
              <Pause className="h-5 w-5 fill-blue-600 text-blue-600" />
              <h3 className="flex flex-col items-center text-xl font-bold text-gray-800 md:flex-row md:gap-3">
                Cool-DOWN
                <span className="text-lg font-semibold">(5 min)</span>
              </h3>
              <Pause className="h-5 w-5 fill-blue-600 text-blue-600" />
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Numbering number={1} bgColor="bg-blue-500" />
                  Hamstring Stretch (30 sec each leg) 🤸‍♀️
                </li>
                <li className="flex items-center gap-2">
                  <Numbering number={2} bgColor="bg-blue-500" />
                  Child's Pose (60 sec) 🧘‍♀️
                </li>
                <li className="flex items-center gap-2">
                  <Numbering number={3} bgColor="bg-blue-500" />
                  Spinal Twist (30 sec each side) 🌀
                </li>
              </ul>
            </div>
          </div>

          {/* Log Workout Button */}
          <Button className="gradient-primary w-full text-white hover:opacity-90">
            Log Workout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutPage;
