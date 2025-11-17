import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getCurrentUserOrganization } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Shape of goals JSON stored in org_goals.goals
// This is intentionally flexible so we can add more metrics later.
type GoalsPayload = {
  revenueYTD?: number;
  unitsYTD?: number;
  gpYTD?: number;
  revenueQTD?: number;
  unitsQTD?: number;
  gpQTD?: number;
  revenueMTD?: number;
  unitsMTD?: number;
  gpMTD?: number;
};

/**
 * GET /api/goals
 * Retrieve goals for the current user's organization
 */
export async function GET() {
  try {
    // Authenticate user
    await getCurrentUser();

    // Get user's organization
    const organization = await getCurrentUserOrganization();
    if (!organization) {
      return NextResponse.json(
        { error: "User is not a member of any organization" },
        { status: 403 }
      );
    }

    // Fetch goals from database
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("org_goals")
      .select("goals")
      .eq("organization_id", organization.id)
      .single();

    if (error) {
      // If no record exists, return empty goals
      if (error.code === "PGRST116") {
        return NextResponse.json({ goals: {} as GoalsPayload });
      }
      console.error("Error fetching goals:", error);
      return NextResponse.json(
        { error: "Failed to fetch goals" },
        { status: 500 }
      );
    }

    const goals = (data?.goals as GoalsPayload) || {};
    
    // Log successful fetch
    console.log("✅ Goals fetched successfully from Supabase:", {
      organization_id: organization.id,
      organization_name: organization.name,
      goals,
    });

    return NextResponse.json({ goals });
  } catch (error: any) {
    console.error("Error in GET /api/goals:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/goals
 * Save goals for the current user's organization
 * Requires user to be owner or admin of the organization
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Get user's organization
    const organization = await getCurrentUserOrganization();
    if (!organization) {
      return NextResponse.json(
        { error: "User is not a member of any organization" },
        { status: 403 }
      );
    }

    // Verify user has permission to modify goals (owner or admin)
    const supabase = await createClient();
    const { data: membership, error: membershipError } = await supabase
      .from("memberships")
      .select("role")
      .eq("organization_id", organization.id)
      .eq("user_id", user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "Failed to verify membership" },
        { status: 403 }
      );
    }

    if (membership.role !== "owner" && membership.role !== "admin") {
      return NextResponse.json(
        { error: "Only owners and admins can modify goals" },
        { status: 403 }
      );
    }

    // Parse request body
    let body: GoalsPayload;
    try {
      body = (await request.json()) as GoalsPayload;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Upsert goals (insert or update)
    const { data: updatedData, error: upsertError } = await supabase
      .from("org_goals")
      .upsert(
        {
          organization_id: organization.id,
          goals: body,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "organization_id",
        }
      )
      .select()
      .single();

    if (upsertError) {
      console.error("Error saving goals:", upsertError);
      return NextResponse.json(
        { error: "Failed to save goals" },
        { status: 500 }
      );
    }

    // Log successful save
    console.log("✅ Goals saved successfully to Supabase:", {
      organization_id: organization.id,
      organization_name: organization.name,
      goals: updatedData?.goals,
      updated_at: updatedData?.updated_at,
    });

    return NextResponse.json({
      success: true,
      goals: updatedData?.goals as GoalsPayload,
    });
  } catch (error: any) {
    console.error("Error in POST /api/goals:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


