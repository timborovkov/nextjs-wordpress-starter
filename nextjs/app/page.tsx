import { redirect } from "next/navigation";
import { getWebsiteSettings } from "@/lib/wordpress";

// Revalidate every hour
export const revalidate = 3600;

export default async function RootPage() {
  try {
    // Get website settings to determine default language
    const settings = await getWebsiteSettings();

    // Find the default language
    const defaultLanguage = settings.languages.find((lang) => lang.is_default);

    if (defaultLanguage) {
      // Redirect to the default language home page
      redirect(`/${defaultLanguage.code}`);
    } else {
      // Fallback to English if no default language found
      redirect("/en");
    }
  } catch (error) {
    console.error("Error getting website settings:", error);
    // Fallback redirect to English
    redirect("/en");
  }
}
