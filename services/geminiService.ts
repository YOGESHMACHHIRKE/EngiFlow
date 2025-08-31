import type { Reviewer, DocumentStatus } from '../types';

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

  // In a real implementation, you would use the Gemini API.
  
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

/**
 * Simulates a call to the Gemini API to generate an email notifying all participants
 * about a status change on a document.
 * 
 * @param documentName The name of the document.
 * @param status The new status of the document.
 * @param updatedBy The name of the user who made the change.
 * @param comment An optional comment with the status change.
 * @param participants A list of email addresses to be notified.
 * @returns A promise that resolves to a formatted email string.
 */
export const generateStatusUpdateEmail = async (
  documentName: string,
  status: DocumentStatus,
  updatedBy: string,
  comment: string | undefined,
  participants: string[]
): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real implementation, you would use the Gemini API.

    // Mocked response for demonstration
    const subject = `Subject: Status Update for Document: "${documentName}" is now ${status}`;
    const body = `
Hello Team,

This email is to notify you of a status change for the document "${documentName}".

New Status: ${status}
Updated By: ${updatedBy}
Date: ${new Date().toLocaleString()}

Comment:
${comment || 'No comment was provided.'}

You can view the document and its full history on the EngiFlow platform.

Regards,
The EngiFlow System
    `;

    // In a real app, you'd send this to the `participants` emails.
    // For now, we'll just return the content to be displayed in an alert.
    return `${subject}\n\n${body}`;
};