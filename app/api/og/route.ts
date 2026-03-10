import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "bot" },
      redirect: "follow",
    });
    const html = await res.text();

    const ogImage =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i
      )?.[1] ??
      html.match(
        /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i
      )?.[1];

    if (ogImage) {
      return NextResponse.json({ ogImage }, { headers: { "Cache-Control": "public, max-age=86400" } });
    }

    return NextResponse.json({ ogImage: null });
  } catch {
    return NextResponse.json({ ogImage: null });
  }
}
