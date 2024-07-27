import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  const { messages } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY || '';

  const openai = new OpenAI({
    apiKey:  apiKey,
  });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content: `CONTEXT: You are an expert at predicting the dollar worth of resumes.
-------
TASK: 
- You will receive a resume from a user as a test input.
- Analyze the resume and provide an estimated worth in US dollars
- Provide 4 short bullet points explanation of the key factors contributing to the assessment,
and 4 tips on how they can improve their worth. Each bullet point should be less than 1 line.
-------
OUTPUT FORMAT: 
<Estimated Worth>$...</Estimated Worth>
<Explanation>
   <ul>
      <li>...</li>
      <li>...</li>
      <li>...</li>
      ...
   </ul>
</Explanation>
<Improvements>
   <ul>
      <li>...</li>
      <li>...</li>
      <li>...</li>
      ...
   </ul>
</Improvements>`
      },
      ...messages,
    ],
    stream: true,
    temperature: 1,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
  
}

// export async function POST(req: Request, res: Response) {
//   const requestBody = await req.json();
//   const apiKey = process.env.OPENAI_API_KEY || '';

//   const openai = new OpenAI({
//     apiKey: apiKey,
//   });

//   // Ensure messages is an array
//   const messages = Array.isArray(requestBody.messages) ? requestBody.messages : [];

//   const response = await openai.chat.completions.create({
//     model: "gpt-4-1106-preview",
//     messages: [
//       {
//         role: "system",
//         content: `CONTEXT: You are an expert at predicting the dollar worth of resumes.
// -------
// TASK: 
// - You will receive a resume from a user as a test input.
// - Analyze the resume and provide an estimated worth in US dollars
// - Provide 4 short bullet points explanation of the key factors contributing to the assessment,
// and 4 tips on how they can improve their worth. Each bullet point should be less than 1 line.
// -------
// OUTPUT FORMAT: 
// <Estimated Worth>$...</Estimated Worth>
// <Explanation>
//    <ul>
//       <li>...</li>
//       <li>...</li>
//       <li>...</li>
//       ...
//    </ul>
// </Explanation>
// <Improvements>
//    <ul>
//       <li>...</li>
//       <li>...</li>
//       <li>...</li>
//       ...
//    </ul>
// </Improvements>`
//       },
//       ...messages, // This is now guaranteed to be an array
//     ],
//     stream: true,
//     temperature: 1,
//   });

//   const stream = OpenAIStream(response);
//   return new StreamingTextResponse(stream);
// }