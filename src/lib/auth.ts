import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user
 * Throws redirect if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/signin");
  }

  return user;
}

/**
 * Get the current authenticated user without redirecting
 * Returns null if not authenticated
 */
export async function getCurrentUserOptional() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Get the current user's profile from the users table
 */
export async function getCurrentUserProfile() {
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return profile;
}

/**
 * Get the current user's organization memberships
 */
export async function getUserMemberships(userId: string) {
  const supabase = await createClient();

  const { data: memberships, error } = await supabase
    .from("memberships")
    .select(
      `
      *,
      organization:organizations(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching memberships:", error);
    return [];
  }

  return memberships || [];
}

/**
 * Get the current user's primary organization (first one they belong to)
 */
export async function getCurrentUserOrganization() {
  const user = await getCurrentUser();
  const memberships = await getUserMemberships(user.id);

  if (memberships.length === 0) {
    return null;
  }

  return memberships[0].organization;
}

