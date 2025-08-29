import { NextRequest, NextResponse } from "next/server";

const AWS_TRANSCRIBE_API = process.env.AWS_TRANSCRIBE_API!;
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const audioUrl = sp.get("audio_url");

    if (!audioUrl) {
      return NextResponse.json({ error: "Missing Audio URL" }, { status: 400 });
    }

    const qs = `audio_url=${encodeURIComponent(audioUrl)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // transcribe may take longer
    const awsUrl = `${AWS_TRANSCRIBE_API}?${qs}`;

    const res = await fetch(awsUrl, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error from transcribe", status: res.status, data },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    const aborted = err?.name === "AbortError";
    return NextResponse.json(
      { error: aborted ? "Transcribe timed out" : String(err) },
      { status: aborted ? 504 : 500 }
    );
  }
}
