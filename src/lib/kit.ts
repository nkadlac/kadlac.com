// Kit.com (ConvertKit) API utility
// Fetches subscriber count at build time

const KIT_API_SECRET = import.meta.env.KIT_API_SECRET;
const KIT_FORM_ID = '3725037';

export async function getSubscriberCount(): Promise<number> {
  // Fallback if no API key is configured
  if (!KIT_API_SECRET) {
    console.warn('KIT_API_SECRET not configured, using fallback subscriber count');
    return 3800;
  }

  try {
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscriptions?api_secret=${KIT_API_SECRET}`
    );

    if (!response.ok) {
      console.error('Kit API error:', response.status);
      return 3800;
    }

    const data = await response.json();
    return data.total_subscriptions || 3800;
  } catch (error) {
    console.error('Failed to fetch subscriber count:', error);
    return 3800;
  }
}

export function formatSubscriberCount(count: number): string {
  // Round down to nearest hundred for display (e.g., 3847 -> "3,800+")
  const rounded = Math.floor(count / 100) * 100;
  return `${rounded.toLocaleString()}+`;
}
