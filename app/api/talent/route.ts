import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_TALENT_API_URL;
  const API_KEY = process.env.TALENT_PROTOCOL_API_KEY || "";

  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_TALENT_API_URL environment variable is required" },
      { status: 500 }
    );
  }
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint parameter is required" }, { status: 400 });
  }

  try {
    // Build query string from remaining params (excluding endpoint)
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "endpoint") {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (API_KEY) {
      headers["X-API-KEY"] = API_KEY;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "API request failed" }));
      return NextResponse.json(
        { error: error.message || error.error || `API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Talent Protocol API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

