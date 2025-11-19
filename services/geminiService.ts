import { GoogleGenAI, Type, Schema } from "@google/genai";
import { OptimizationConfig, ServerRam, WorkloadType, NetworkCondition, GeneratedResult } from "../types";

const getPrompt = (config: OptimizationConfig): string => {
  return `
    You are an expert Linux System Administrator and Network Engineer specializing in kernel tuning.
    Generate a highly optimized bash script to tune TCP/IP kernel parameters (sysctl) for an Ubuntu server.

    Target System Specifications:
    - RAM Profile: ${config.ram} (Low=<4GB, Medium=4-16GB, High=16-64GB, Extreme=>64GB)
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
};

const responseSchema: Schema = {
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

export const generateTcpScript = async (config: OptimizationConfig): Promise<GeneratedResult> => {
  try {
    // Hybrid Logic:
    // 1. If API_KEY exists in the process (Local Dev / Preview Env), use Client-Side SDK directly.
    // 2. If API_KEY is missing (Production/Cloudflare), call the Backend API.
    
    const apiKey = process.env.API_KEY;

    if (apiKey) {
      // --- CLIENT SIDE EXECUTION (Dev/Preview) ---
      console.log("Using Client-Side Gemini SDK");
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: getPrompt(config),
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.3, 
        }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text) as GeneratedResult;

    } else {
      // --- SERVER SIDE EXECUTION (Cloudflare Pages) ---
      console.log("Using Cloudflare Backend API");
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`Server Error: ${response.status} ${errData.error || ''}`);
      }

      const result = await response.json();
      return result as GeneratedResult;
    }

  } catch (error) {
    console.error("Error generating script:", error);
    throw error;
  }
};