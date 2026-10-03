import { Injectable } from '@nestjs/common';

export interface AiChatResult {
  response: string;

  chart?: {
    type: 'bar' | 'pie';
    labels: string[];
    values: number[];
  } | null;
}

@Injectable()
export class AiService {

  async chat(messages: any[]): Promise<AiChatResult> {

    const response = await fetch(
      'http://localhost:11434/api/chat',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({

          model: 'llama3.2:3b',

          messages: [
            {
              role: 'system',

              content: `
                You are an AI assistant inside a chat application.

                You must always respond using valid JSON.

                The JSON must have exactly this structure:

                {
                "response": "your normal text response",
                "chart": null
                }

                If the user asks for a graph, chart, or visualization of numerical data, return:

                {
                "response": "a short explanation",
                "chart": {
                    "type": "bar",
                    "labels": ["Label 1", "Label 2"],
                    "values": [10, 20]
                }
                }

                Chart rules:

                - "type" must be either "bar" or "pie".
                - Use "pie" when the user explicitly asks for a pie chart.
                - Use "bar" when the user explicitly asks for a bar chart.
                - If the user asks for a graph without specifying the type, use "bar".
                - "labels" and "values" must have the same number of items.
                - "values" must contain numbers only.
                - "chart" must be null when no chart is requested.
                - Do not use Markdown code fences around the JSON.
                - Return JSON only.
              `
            },

            ...messages.map(message => ({
              role: message.role,
              content: message.content
            }))
          ],

          stream: false,

          format: 'json'
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        `Ollama request failed: ${response.status}`
      );
    }

    const data = await response.json();

    try {

      return JSON.parse(data.message.content);

    } catch {

      return {
        response: data.message.content,
        chart: null
      };

    }
  }

  
}