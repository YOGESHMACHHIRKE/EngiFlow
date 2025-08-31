import type { Reviewer } from '../types';

// This is a MOCK service. In a real application, this would be a backend service
// that securely calls the GoogleGenAI API. We are simulating the API call here
// to avoid exposing API keys on the client-side and to adhere to the project constraints.

/**
 * Simulates a call to the Gemini API to generate a professional email
 * notifying reviewers about a new document.
 * 
 * @param documentName The name of the document to be reviewed.
 * @param reviewers A list of reviewer objects with email and role.
 * @returns A promise that resolves to a formatted email string.
 */
export const generateReviewEmail = async (
  documentName: string,
  reviewers: Reviewer[]
): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // In a real implementation, you would use the Gemini API like this:
  /*
    import { GoogleGenAI } from "@google/genai";
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const reviewerList = reviewers.map(r => `- ${r.email} (${r.role})`).join('\n');
    const prompt = `
      Generate a professional and concise email to a list of engineering reviewers.
      The subject should be "Action Required: Document Review - [Document Name]".
      The body should state that the document "[Document Name]" has been uploaded for their review.
      Tailor the call to action based on their role (e.g., 'your approval is requested', 'your comments are requested').
      Mention that they can access the document via the EngiFlow platform.
      Do not include a sign-off or greeting, just the subject and body.

      Document Name: "${documentName}"
      Reviewers:
      ${reviewerList}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text;
  */

  // Mocked response for demonstration purposes
  const subject = `Subject: Action Required: Document Review - ${documentName}`;
  const reviewerDetails = reviewers.map(r => `- ${r.email} (Role: ${r.role})`).join('\n');
  
  const body = `
Dear Review Team,

This is an automated notification to inform you that the document "${documentName}" has been uploaded to the EngiFlow platform and requires your attention.

Please log in to the system to access the document and take the appropriate action based on your assigned role.

Assigned Reviewers:
${reviewerDetails}

Your prompt attention to this matter is greatly appreciated.

Thank you,
EngiFlow System
  `;

  return `${subject}\n\n${body}`;
};