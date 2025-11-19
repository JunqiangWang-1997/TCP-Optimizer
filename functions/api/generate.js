import { GoogleGenAI, Type } from "@google/genai";

export async function onRequestPost(context) {
  try {
    // Get the API Key from Cloudflare Environment Variables
    const apiKey = context.env.API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server configuration error: API Key missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the request body from the frontend
    const config = await context.request.json();

    // Reconstruct the prompt server-side
    // (We duplicate this logic here to ensure the backend is self-contained and doesn't rely on frontend build artifacts)
    const prompt = `
    You are an expert Linux System Administrator and Network Engineer specializing in kernel tuning.
    Generate a highly optimized bash script to tune TCP/IP kernel parameters (sysctl) for an Ubuntu server.

    Target System Specifications:
    - RAM Profile: ${config.ram}
    - Workload Type: ${config.workload}
    - Network Interface: ${config.network}

    Requirements for the Bash Script:
    1. Must check for root privileges.
    2. Must backup existing /etc/sysctl.conf.
    3. Must append or update settings in a new file /etc/sysctl.d/99-custom-tuning.conf.
    4. Apply changes immediately with 'sysctl -p'.
    5. Include clear comments explaining key parameters (e.g., tcp_max_syn_backlog, somaxconn, tcp_tw_reuse, BBR congestion control).
    6. If the network is high speed or BBR is suitable, enable BBR.
    7. Ensure parameters are safe and won't crash the kernel.

    Requirements for Explanation:
    1. Explain why specific buffers (rmem/wmem) were chosen based on the RAM.
    2. Explain the choice of congestion control (Cubic vs BBR).
    3. Explain how the workload type influenced the parameter selection.
  `;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        bashScript: {
          type: Type.STRING,
          description: "The executable bash script content.",
        },
        technicalExplanation: {
          type: Type.STRING,
          description: "A markdown formatted technical explanation of the changes.",
        },
      },
      required: ["bashScript", "technicalExplanation"],
    };

    // Initialize Gemini Client
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      }
    });

    const text = response.text;
    
    return new Response(text, {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Cloudflare Worker Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}