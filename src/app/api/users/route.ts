import { NextResponse } from "next/server";
import { getAllUsers } from "@lib/userStore";

export async function GET(): Promise<NextResponse> {
  try {
    const users = getAllUsers();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get users", users: [] },
      { status: 500 }
    );
  }
}
