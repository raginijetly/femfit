import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Loader2 } from "lucide-react";
import { UI_DELAY } from "@/utils/constants";

type ArticleCategory =
  | "All"
  | "Fitness"
  | "Nutrition"
  | "Cycle Insights"
  | "Wellness";

interface Article {
  id: number;
  title: string;
  description: string;
  category: ArticleCategory;
  readTime: string;
}

const InfoHubPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>("All");

  // Sample article data
  const articles: Article[] = [
    {
      id: 1,
      title: "How Workouts Affect Your Mood",
      description:
        "Discover the connection between exercise and emotional wellbeing throughout your cycle.",
      category: "Fitness",
      readTime: "4 min read",
    },
    {
      id: 2,
      title: "Nutrition Guide: Eating for Your Cycle",
      description:
        "Learn which foods can help balance hormones and reduce symptoms during different phases.",
      category: "Nutrition",
      readTime: "6 min read",
    },
    {
      id: 3,
      title: "Understanding Your Menstrual Cycle",
      description:
        "A comprehensive guide to the four phases and how they affect your body and mind.",
      category: "Cycle Insights",
      readTime: "7 min read",
    },
    {
      id: 4,
      title: "Meditation Techniques for PMS",
      description:
        "Simple meditation practices to reduce stress and anxiety before your period.",
      category: "Wellness",
      readTime: "5 min read",
    },
    {
      id: 5,
      title: "Strength Training During Your Cycle",
      description:
        "How to adjust your strength workouts for optimal results throughout your cycle.",
      category: "Fitness",
      readTime: "5 min read",
    },
    {
      id: 6,
      title: "Anti-Inflammatory Foods for Period Pain",
      description:
        "Dietary choices that can help reduce inflammation and ease menstrual cramps.",
      category: "Nutrition",
      readTime: "4 min read",
    },
  ];

  // Filter articles based on selected category
  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((article) => article.category === activeCategory);

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
    <div className="gradient-primary flex min-h-screen flex-col items-center justify-center">
      {/* Main content */}
      <main className="container mx-auto px-4 py-24">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="bg-purple-100 p-6">
            <h2 className="flex items-center text-2xl font-bold text-purple-800">
              <BookOpen className="mr-2 h-6 w-6" />
              Info Hub
            </h2>
            <p className="mt-2 text-purple-700">
              Articles and resources for women's health
            </p>
          </div>

          {/* Category filters - single row, left-aligned */}
          <div className="px-6 pt-6">
            <div className="flex flex-wrap justify-start gap-1.5 pb-2">
              {(
                [
                  "All",
                  "Fitness",
                  "Nutrition",
                  "Cycle Insights",
                  "Wellness",
                ] as ArticleCategory[]
              ).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Articles list */}
          <div className="p-6">
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="border-b border-gray-100 pb-6 last:border-0"
                  >
                    <div className="mb-1 text-xs text-gray-500">
                      {article.category}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      {article.title}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {article.readTime}
                      </span>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm text-purple-600"
                      >
                        Read more
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">
                  No articles found in this category.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfoHubPage;
